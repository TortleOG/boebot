exports.run = async (client, msg) => {
  const row = await this.provider.get("currency", msg.author.id);
  if (!row) await this.provider.create("currency", msg.author.id, { amount: 1000 });
  await this.provider.update("currency", msg.author.id, { amount: row.amount + 1000 });
  return msg.send(`${msg.author} | Congradulations! Here is **$1000.**`);
};

exports.init = (client) => {
  if (!client.providers.has("sqlite")) throw new Error("The Provider 'sqlite' does not seem to exist.");
  this.provider = client.providers.get("sqlite");
};

exports.conf = {
  enabled: true,
  runIn: ["text", "dm"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 43200,
};

exports.help = {
  name: "daily",
  description: "Collects your daily reward!",
  usage: "",
  usageDelim: "",
  extendedHelp: "",
};
