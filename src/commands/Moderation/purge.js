exports.run = async (client, msg, [user, amount]) => {
  if (!amount && !user) return msg.reply("Must specify a user and amount, or just an amount, of messages to purge!");
  msg.channel.messages.fetch({ limit: amount }).then((messages) => {
    if (user) {
      const filterBy = user ? user.id : this.client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }
    msg.channel.bulkDelete(messages).catch(error => console.log(error.stack));
  });
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 2,
  botPerms: ["MANAGE_MESSAGES"],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "purge",
  description: "This will remove X amount of messages sent in a channel.",
  usage: "[user:user] <amount:int{2,100}>",
  usageDelim: " ",
};
