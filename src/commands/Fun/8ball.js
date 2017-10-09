const answers = [
  "Maybe.", "I hope so.", "There is a good chance.", "Quite likely.", "I think so.", "I hope so.", "Hell, yes.", "Possibly.", "There is a small chance.", "Yes!", "As I see it, yes.", "It is certain.", "It is decidedly so.",
  "Certainly not.", "Not in your wildest dreams.", "I hope not.", "Never!", "Fuhgeddaboudit.", "Ahaha! Really?!?", "Pfft.", "Sorry, bucko.", "Hell to the no.", "The future is bleak.", "The future is uncertain.", "I would rather not say.", "Who cares?", "Never, ever, ever.", "Don’t count on it.",
  "My reply is no.", "My sources say no.", "Very doubtful.", "That was dumb.", "Is math hard for you?", "Stand up and I'll bop you.",
];

exports.run = (client, msg, [query]) => {
  if (query.endsWith("?")) return msg.channel.send(`**Magic 🎱 says**: *${answers[Math.floor(Math.random() * answers.length)]}*`);
  return msg.reply("**Magic 🎱 says**: That doesn't look like a question, try again please.");
};

exports.conf = {
  enabled: true,
  runIn: ["text", "dm", "group"],
  aliases: ["8", "magic8"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "8ball",
  description: "Execute commands in the terminal, use with EXTREME CAUTION.",
  usage: "<query:str>",
  usageDelim: "",
  extendedHelp: "",
};
