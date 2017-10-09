const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) return msg.send("`❌` | I cannot mute other bots.");

  const modRole = msg.guild.roles.get(msg.guild.settings.modRole);
  const adminRole = msg.guild.roles.get(msg.guild.settings.adminRole);
  if (!modRole || !adminRole) return msg.send("`❌` | No mod/admin role found.");
  if (member.roles.has(modRole.id) || member.roles.has(adminRole.id)) return msg.send("`❌` | I cannot mute other mods/admins.");

  const muteRole = msg.guild.roles.get(msg.guild.settings.muteRole);
  if (!muteRole) return msg.send("`❌` | No mute role found.");

  if (reason.length === 0) reason = await msg.prompt("**Reason?**");
  if (reason === null) return msg.send("`❌` | No response found. Aborting...");

  if (member.roles.has(muteRole.id)) return msg.send("`❌` | This user is already muted. Aborting...");

  await member.addRole(muteRole).catch(err => msg.send(`\`❌\` | It seems an error has occured. This shouldn't have happended. Please contact the bot owner.\n\`\`\`${err}\`\`\``));
  new Modlog(client)
    .setType("mute")
    .setMember(member)
    .setMod(msg.member)
    .setReason(Array.isArray(reason) ? reason.join(" ") : reason)
    .send(msg);
  return msg.send("`✅` User successfully muted.");
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
