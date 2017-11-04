exports.run = async (client, msg, [selected]) => {
  const { modlogs } = await this.provider.get("modlogs", msg.guild.id);
  const log = modlogs[selected === "latest" ? modlogs.length - 1 : selected - 1];
  if (!log) return msg.send(`\`|❌|\` ${msg.author}, there are no modlogs with that case number.`);
  return msg.send([
    `Type       : ${log.type}`,
    `User       : ${log.user.tag} | ${log.user.id}`,
    `Moderator  : ${log.mod.tag} | ${log.mod.id}`,
    `Reason     : ${log.reason}`,
  ], { code: "http" });
};

exports.init = (client) => {
  this.provider = client.providers.get("rethinkdb");
  if (!this.provider.hasTable("modlogs")) this.provider.createTable("modlogs");
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
  name: "case",
  description: "Check a case.",
  usage: "<case:int|latest>",
  usageDelim: "",
  extendedHelp: "",
};
