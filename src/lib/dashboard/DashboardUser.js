const DashboardGuild = require("./DashboardGuild");

/**
 * A class to create new Dashboard users.
 */
class DashboardUser {
  /**
   * Creates a new instance of a Dashboard User.
   * @param {BoeBot} client The BoeBot client.
   * @param {external:Discord.User} user The user that logged in.
   */
  constructor(client, user) {
    /**
     * BoeBot Client.
     * @type {BoeBot}
     */
    this.client = client;

    /**
     * The users ID.
     * @type {string}
     */
    this.id = user.id;

    /**
     * The users username.
     * @type {string}
     */
    this.username = user.username;

    /**
     * The users discrim.
     * @type {string}
     */
    this.discriminator = user.discriminator;

    /**
     * The users avatar URL.
     * @type {string}
     */
    this.avatar = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith("a ") ? "gif" : "webp"}` : null;

    /**
     * A collection of guilds the user is in.
     * @type {external:Discord.Collection}
     */
    this.guilds = new this.client.methods.Collection();

    this.constructor.setupGuilds(this, user.guilds);

    /**
     * A collection of guilds the user has permissions in.
     * @type {external:Discord.Collection}
     */
    this.managableGuilds = this.guilds.filter(guild => guild.permissions.has("MANAGE_GUILD"));
  }

  /**
   * Grabs a user object.
   * @return {external:Discord.User}
   */
  get user() {
    return this.client.users.get(this.id);
  }

  /**
   * Returns a users tag.
   * @return {string}
   */
  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  /**
   * Setups the guilds property with a users guilds.
   * @param {Class} dashboardUser This class.
   * @param {external:Discord.Collection} guilds A collection of guilds.
   */
  static setupGuilds(dashboardUser, guilds) {
    guilds.forEach((guild) => {
      dashboardUser.guilds.set(guild.id, new DashboardGuild(dashboardUser.client, guild));
    });
  }

  /**
   * Check if the user is an Admin.
   * @type {boolean}
   */
  get isAdmin() {
    if (this.id === this.client.config.ownerID) return true;
    return false;
  }

  /**
   * Returns guild info of managed guilds in an array
   * @type {Object[]}
   */
  get manageGuildInfo() {
    const arr = [];
    this.managableGuilds.forEach(g =>
      arr.push({
        id: g.id,
        name: g.name,
        icon: g.icon,
        imIn: this.client.guilds.has(g.id),
      }));
    return arr;
  }
}

module.exports = DashboardUser;
