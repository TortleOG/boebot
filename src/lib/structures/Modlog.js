module.exports = class ModLog {
  constructor(guild) {
    Object.defineProperty(this, "guild", { value: guild });

    Object.defineProperty(this, "client", { value: guild.client });

    this.type = null;
    this.user = null;
    this.mod = null;
    this.reason = null;
  }

  setType(type) {
    this.type = type;
    return this;
  }

  setUser(user) {
    this.user = {
      tag: user.tag,
      id: user.id,
    };
    return this;
  }

  setMod(mod) {
    this.mod = {
      tag: mod.tag,
      id: mod.id,
    };
    return this;
  }

  setReason(reason) {
    this.reason = reason;
    return this;
  }

  send() {
    const modLog = this.guild.channels.get(this.guild.settings.modLog);
    if (!modLog) throw "Did not find a mod-log channel.";

    return modLog.send({ embed: this.embed });
  }

  static title(type) {
    switch (type) {
      case "ban": return "Banned";
      case "unban": return "Unbanned";
      case "mute": return "Muted";
      case "unmute": return "Unmuted";
      case "kick": return "Kicked";
      case "warn": return "Warned";
      default: // this will never happen
    }
  }

  static color(type) {
    switch (type) {
      case "ban": return 0xcc0000;
      case "unban": return 0x2d862d;
      case "kick": return 0xe65c00;
      case "mute":
      case "unmute": return 0x993366;
      case "warn": return 0xf2f20d;
      default: return 0xFFFFFF;
    }
  }

  get embed() {
    const embed = new this.client.methods.Embed()
      .setTitle(`User ${ModLog.title(this.type)}`)
      .setColor(ModLog.color(this.type))
      .setDescription([
        `**Member**: ${this.user.tag} | ${this.user.id}`,
        `**Moderator**: ${this.mod.tag}`,
        `**Reason**: ${this.reason}`,
      ].join("\n"))
      .setTimestamp()
      .setFooter(this.type.capitalize(), this.client.user.displayAvatarURL({ format: "jpg" }));
    return embed;
  }
};
