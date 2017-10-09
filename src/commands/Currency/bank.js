exports.run = async (client, msg, [action, user, amount = 0]) => {
  try {
    switch (action) {
      case "-s":
      case "--set": {
        if (msg.author.id !== msg.guild.owner.id) return;
        const row = await this.provider.get("currency", user.id);
        if (!row) await this.provider.create("currency", user.id, { amount });
        await this.provider.update("currency", row.id, { amount });
        return msg.send(`\`✅\` | Set **${user.tag}'s** account balance to **$${amount}**.`);
      }
      case "-c":
      case "--clear": {
        if (msg.author.id !== msg.guild.owner.id) return;
        const row = await this.provider.get("currency", user.id);
        if (!row) await this.provider.create("currency", user.id, { amount: 0 });
        await this.provider.update("currency", row.id, { amount: 0 });
        return msg.send(`\`✅\` | Cleared **${user.tag}'s** account balance.`);
      }
      default: {
        const row = await this.provider.get("currency", user ? user.id : msg.author.id);
        if (!row) return msg.send(`\`❌\` | ${user ? "This user has no money in their bank." : "You do not have any money in your bank account."}`);
        return msg.send(`${msg.author} | ${user ? `**${user.tag}'s** balance is **$${row.amount}**.` : `Your balance is **$${row.amount}**.`}`);
      }
    }
  } catch (err) {
    return msg.send(`It seems an error has occured.\n${err}`);
  }
};

exports.init = async (client) => {
  if (!client.providers.has("sqlite")) throw new Error(`The Provider ${this.providerEngine} does not seem to exist.`);
  this.provider = client.providers.get("sqlite");
  if (!(await this.provider.hasTable("currency"))) {
    const SQLCreate = ["id TEXT NOT NULL UNIQUE", "amount INTEGER NOT NULL DEFAULT 0"];
    await this.provider.createTable("currency", SQLCreate).catch(err => console.error(err));
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
