const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) throw "`|❌|` I cannot warn other bots.";

  if (member.highestRole.position >= msg.member.highestRole.position) throw `\`|❌|\` ${msg.author}, I cannot execute moderation commands on this member.`;

  reason = reason.length === 0 ? await msg.prompt("**Reason?**") : reason.join(" ");

  if (msg.guild.settings.modLog) {
    new Modlog(msg.guild)
      .setType("warn")
      .setUser(member.user)
      .setMod(msg.author)
      .setReason(reason || `No reason specified. Write '${msg.guild.settings.prefix}reason <case#>' to claim this log.`)
      .send();
  }

  return msg.send(`\`|⚠|\` **${member.user.tag}** successfully warned by **${msg.author.tag}** for:\n**${reason}**.`);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 2,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "warn",
  description: "Warns members from the guild.",
  usage: "<member:member> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
