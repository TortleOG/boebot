const Modlog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [user, ...reason]) => {
  reason = reason.length === 0 ? await msg.prompt("**Reason?**") : reason.join(" ");

  const bans = await msg.guild.fetchBans();
  if (!bans.has(user.id)) throw `\`|❌|\` ${msg.author}, this user is not banned.`;

  await msg.guild.unban(user, reason);

  if (msg.guild.settings.modLog) {
    new Modlog(msg.guild)
      .setType("unban")
      .setUser(user)
      .setMod(msg.author)
      .setReason(reason || `No reason specified. Write '${msg.guild.settings.prefix}reason <case#>' to claim this log.`)
      .send();
  }

  return msg.send(`\`|✅|\` **${user.tag}** successfully unbanned by **${msg.author.tag}** for:\n**${reason}**.`);
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
  usage: "<user:user> [reason:str] [...]",
  usageDelim: " ",
  extendedHelp: "",
};
