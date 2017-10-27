const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) throw "`|❌|` I cannot kick other bots.";

  if (!member.kickable) throw `\`|❌|\` ${msg.author}, I cannot kick this member.`;

  if (member.highestRole.position >= msg.member.highestRole.position) throw `\`|❌|\` ${msg.author}, I cannot execute moderation commands on this member.`;

  reason = reason.length === 0 ? await msg.prompt("**Reason?**") : reason.join(" ");
  if (reason === null) throw "`|❌|` No response found. Aborting...";

  await member.kick(reason);

  if (msg.guild.settings.modLog) {
    new Modlog(msg.guild)
      .setType("kick")
      .setMember(member.user)
      .setMod(msg.author)
      .setReason(reason)
      .send();
  }

  return msg.send(`\`|🛑|\` **${member.user.tag}** successfully kicked by **${msg.author.tag}** for:\n**${reason}**.`);
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 3,
  botPerms: ["KICK_MEMBERS"],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "kick",
  description: "Kicks members from the guild.",
  usage: "<member:member> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
