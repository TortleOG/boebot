const ms = require("ms");

exports.run = async (client, msg, [time, ...action]) => setTimeout(() => msg.channel.send(`:clock12: ${msg.author} | **Reminder**: ${action.join(" ")}`), ms(time));

exports.conf = {
  enabled: true,
  runIn: ["text", "dm", "group"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: [],
  cooldown: 5,
};

exports.help = {
  name: "remind",
  description: "Reminds you of an action.",
  usage: "<time:str> <action:str> [...]",
  usageDelim: " ",
  extendedHelp: "",
};
