const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) throw "`|❌|` I cannot unmute other bots.";

  if (member.highestRole.position >= msg.member.highestRole.position) throw `\`|❌|\` ${msg.author}, I cannot execute moderation commands on this member.`;

  const muteRole = msg.guild.roles.get(msg.guild.settings.muteRole);
  if (!muteRole) throw "`|❌|` No mute role found.";

  reason = reason.length === 0 ? await msg.prompt("**Reason?**") : reason.join(" ");
  if (reason === null) throw "`|❌|` No response found. Aborting...";

  if (!member.roles.has(muteRole.id)) throw `\`|❌|\` ${msg.author}, this user isn't muted.`;

  await member.removeRole(muteRole).catch(console.error);

  if (msg.guild.settings.modLog) {
    new Modlog(msg.guild)
      .setType("unmute")
      .setMember(member.user)
      .setMod(msg.author)
      .setReason(reason)
      .send();
  }

  return msg.send(`\`|🔈|\` **${member.user.tag}** successfully unmuted by **${msg.author.tag}** for:\n**${reason}**.`);
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
  name: "unmute",
  description: "Unmutes members from the guild.",
  usage: "<member:member> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
