const { Permissions } = require("discord.js");

/**
 * Used to create a new Guild for a user.
 */
class DashboardGuild {
  /**
   * Creates a new instance of a User's guild.
   * @param {BoeBot} client The BoeBot client.
   * @param {external:Discord.Guild} guild The guild that the user is in.
   */
  constructor(client, guild) {
    /**
     * BoeBot Client.
     * @type {BoeBot}
     */
    this.client = client;

    /**
     * The guild id.
     * @type {string}
     */
    this.id = guild.id;

    /**
     * The guild name.
     * @type {string}
     */
    this.name = guild.name;

    /**
     * If the user is the owner of the guild.
     * @type {boolean}
     */
    this.isOwner = guild.owner;

    /**
     * The guild permission interger.
     * @type {number}
     */
    this.permissions = new Permissions(guild.permissions);

    /**
     * The guild icon URL.
     * @type {string}
     */
    this.icon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null;
  }
}

module.exports = DashboardGuild;
