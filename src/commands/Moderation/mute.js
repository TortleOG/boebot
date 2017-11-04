const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) throw "`|❌|` I cannot unmute other bots.";

  if (member.highestRole.position >= msg.member.highestRole.position) throw `\`|❌|\` ${msg.author}, I cannot execute moderation commands on this member.`;

  const muteRole = msg.guild.roles.get(msg.guild.settings.muteRole);
  if (!muteRole) throw "`|❌|` No mute role found.";

  reason = reason.length === 0 ? await msg.prompt("**Reason?**") : reason.join(" ");

  if (member.roles.has(muteRole.id)) throw `\`|❌|\` ${msg.author}, this user is already muted.`;

  await member.addRole(muteRole).catch(console.error);

  if (msg.guild.settings.modLog) {
    new Modlog(msg.guild)
      .setType("mute")
      .setMember(member.user)
      .setMod(msg.author)
      .setReason(reason || `No reason specified. Write '${msg.guild.settings.prefix}reason <case#>' to claim this log.`)
      .send();
  }

  return msg.send(`\`|🔇|\` **${member.user.tag}** successfully muted by **${msg.author.tag}** for:\n${reason}.`);
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
  name: "mute",
  description: "Mutes members from the guild.",
  usage: "<member:member> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
