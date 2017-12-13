const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) throw "`|❌|` I cannot ban other bots.";

  if (!member.bannable) throw `\`|❌|\` ${msg.author}, I cannot ban this member.`;

  if (member.highestRole.position >= msg.member.highestRole.position) throw `\`|❌|\` ${msg.author}, I cannot execute moderation commands on this member.`;

  reason = reason.length === 0 ? await msg.prompt("**Reason?**") : reason.join(" ");

  await msg.guild.ban(member.user, { reason });

  if (msg.guild.settings.modLog) {
    new Modlog(msg.guild)
      .setType("ban")
      .setUser(member.user)
      .setMod(msg.author)
      .setReason(reason || `No reason specified. Write '${msg.guild.settings.prefix}reason <case#>' to claim this log.`)
      .send();
  }

  return msg.send(`\`|🚨|\` **${member.user.tag}** successfully banned by **${msg.author.tag}** for:\n**${reason}**.`);
};


exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 3,
  botPerms: ["BAN_MEMBERS"],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "ban",
  description: "Bans members from the guild.",
  usage: "<member:member> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
