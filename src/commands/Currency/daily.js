exports.run = async (client, msg) => {
  await client.Currency.add(msg.author, 1000);
  return msg.send(`${msg.author} | Congradulations! Here is **$1000.**`);
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
