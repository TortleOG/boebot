exports.run = async (client, msg, [member, ...reason]) => {
  if (reason.length === 0) reason = await msg.prompt("**Reason?**");
  if (reason === null) return msg.send("`❌` | No response found. Aborting...");
  member.unbanReason = reason.join(" ");
  member.unbanAuth = msg.member;
  msg.guild.unban(member).then(() => msg.send("`✅` User successfully unbanned.")).catch((err) => {
    msg.send(`\`❌\` | It seems an error has occured. This shouldn't have happended. Please contact the bot owner.\n\`\`\`${err}\`\`\``);
    throw err;
  });
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
  name: "unban",
  description: "Unbans members from the guild.",
  usage: "<member:user> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
