exports.run = async (client, msg, [prefix]) => {
  if (!prefix) return msg.send(`This guild's prefix is: \`${msg.guild.settings.prefix}\``);
  if (prefix && msg.author.id === msg.guild.owner.id) {
    client.settings.guilds.update(msg.guild, { prefix });
    return msg.send(`This guild's prefix is now: \`${prefix}\``);
  }
  return msg.send("You do not have permissions to change the guilds prefix.");
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "prefix",
  description: "Displays prefix or changes it.",
  usage: "[prefix:str]",
  usageDelim: "",
  extendedHelp: "",
};
