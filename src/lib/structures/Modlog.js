/**
 * Creates an embed for moderation actions.
 */
class Modlog {
  /**
   * @param {Boebot} client The client the bot was created with.
   */
  constructor(client) {
    /**
     * BoeBot Client
     * @type {BoeBot}
     */
    Object.defineProperty(this, "client", { value: client });
  }

  /**
   * Sets the type of the embed.
   * @param {string} type The type of the embed.
   * @return {class} This class.
   */
  setType(type) {
    if (!type) throw `Expected input 'type' but found ${type}.`;
    this.type = type;
    if (!this.title) throw `${type} is not a valid embed type.`;
    return this;
  }

  /**
   * Sets the offending member for the embed.
   * @param {external:Discord.User | external:Discord.GuildMember} member The offending member.
   * @return {class} This class.
   */
  setMember(member) {
    if (!member) throw `Expected input 'member' but found ${member}.`;
    this.member = {
      name: this.type === "unban" ? member.tag : member.user.tag,
      id: member.id,
    };
    return this;
  }

  /**
   * Sets the moderator for the embed.
   * @param {external:Discord.GuildMember} mod The moderator that created the action.
   * @return {class} This class.
   */
  setMod(mod) {
    if (!mod) throw `Expected input 'mod' but found ${mod}.`;
    this.moderator = {
      name: mod.user.tag,
      id: mod.id,
    };
    return this;
  }

  /**
   * Sets the reason in the embed.
   * @param {string} reason The reason for the action.
   * @return {class} This class.
   */
  setReason(reason) {
    if (!reason) throw `Expected input 'reason' but found ${reason}.`;
    this.reason = reason;
    return this;
  }

  /**
   * Sends the embed to the modlog channel.
   * @param {external:Discord.Message} msg A Discord message.
   * @return {void} Sends the message.
   */
  send(msg) {
    if (!this.type) throw "The embed type has not been set.";
    else if (!this.member) throw "The embed member has not been set.";
    else if (!this.mod) throw "The embed mod has not been set.";
    else if (!this.reason) throw "The embed reason has not been set.";

    let modLog;
    if (!msg.guild) {
      modLog = msg.channels.get(msg.guild.settings.modLog);
    } else {
      modLog = msg.guild.channels.get(msg.guild.settings.modLog);
    }
    if (!modLog) throw "Did not find a mod-log channel.";

    return modLog.send({ embed: this.embed });
  }

  /**
   * The embed title.
   * @type {string}
   */
  get title() {
    const past = {
      ban: "Banned",
      unban: "Unbanned",
      mute: "Muted",
      unmute: "Unmuted",
      kick: "Kicked",
      warn: "Warned",
    };
    return past[this.type];
  }

  /**
   * The hex color for the embed.
   * @type {number}
   */
  get color() {
    const embedTypes = {
      ban: 0xcc0000,
      unban: 0x2d862d,
      kick: 0xe65c00,
      mute: 0x993366,
      unmute: 0x993366,
      warn: 0xf2f20d,
    };
    return embedTypes[this.type];
  }

  /**
   * Creates the embed
   * @type {external:Discord.MessageEmbed} The MessageEmbed
   */
  get embed() {
    const embed = new this.client.methods.Embed()
      .setTitle(`User ${this.title}`)
      .setColor(this.color)
      .setDescription([
        `**Member**: ${this.member.name} | ${this.member.id}`,
        `**Moderator**: ${this.moderator.name}`,
        `**Reason**: ${this.reason}`,
      ].join("\n"))
      .setTimestamp()
      .setFooter(this.type.capitalize(), this.client.user.displayAvatarURL({ format: "jpg" }));
    return embed;
  }
}


module.exports = Modlog;
