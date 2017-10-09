const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [member, ...reason]) => {
  if (member.user.bot) return msg.send("`❌` | I cannot warn other bots.");

  if (reason.length === 0) reason = await msg.prompt("**Reason?**");
  if (reason === null) return msg.send("`❌` | No response found. Aborting...");

  new Modlog(client)
    .setType("warn")
    .setMember(member)
    .setMod(msg.member)
    .setReason(Array.isArray(reason) ? reason.join(" ") : reason)
    .send(msg);
  return msg.send("`✅` User successfully warned.");
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
