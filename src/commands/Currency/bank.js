exports.run = async (client, msg, [action, user, amount = 0]) => {
  switch (action) {
    case "-s":
    case "--set": {
      if (msg.author.id !== msg.guild.owner.id) return;
      await client.Currency.set(user || msg.author, amount).catch((err) => { throw err; });
      return msg.send(`\`✅\` | Set **${user ? user.tag : msg.author.tag}'s** account balance to **$${amount}**.`);
    }
    case "-c":
    case "--clear": {
      if (msg.author.id !== msg.guild.owner.id) return;
      await client.Currency.reset(user || msg.author).catch((err) => { throw err; });
      return msg.send(`\`✅\` | Cleared **${user ? user.tag : msg.author.tag}'s** account balance.`);
    }
    default: {
      const balance = await client.Currency.getBalance(user || msg.author);
      return msg.send(`${msg.author} | ${user ? `**${user.tag}'s** balance is **$${balance}**.` : `Your balance is **$${balance}**.`}`);
    }
  }
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
  name: "bank",
  description: "Displays .",
  usage: "[--set|-s|--clear|-c] [user:mention] [amount:int]",
  usageDelim: " ",
  extendedHelp: "",
};
