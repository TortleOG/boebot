exports.providerEngine = "sqlite";

exports.init = async (client) => {
  if (client.providers.has(this.providerEngine)) this.provider = client.providers.get(this.providerEngine);
  else throw new Error(`The Provider ${this.providerEngine} does not seem to exist.`);
  if (!(await this.provider.hasTable("tags"))) {
    const SQLCreate = ["count INTEGER NOT NULL DEFAULT 0", "id TEXT NOT NULL UNIQUE", "contents TEXT NOT NULL"];
    await this.provider.createTable("tags", SQLCreate);
  }
};

exports.run = async (client, msg, [action, ...contents]) => {
  contents = contents[0] ? contents.join(" ") : null;
  switch (action) {
    case "-a":
    case "--add": {
      if (msg.author.id !== msg.guild.owner.id) return;
      const row = await this.provider.get("tags", contents);
      if (row) return msg.reply("This tag already exists.");
      await this.provider.insert("tags", contents.split(" ")[0], { count: 0, contents: contents.split(" ").slice(1).join(" ") });
      return msg.reply(`The tag \`${contents.split(" ")[0]}\` has been added.`);
    }
    case "-d":
    case "--delete": {
      if (msg.author.id !== msg.guild.owner.id) return;
      const row = await this.provider.get("tags", contents);
      if (!row) return msg.send("`❌` | This tag doesn't seem to exist.");
      await this.provider.delete("tags", row.id).catch(e => msg.reply(`\`❌\` | I wasn't able to delete the tag because of the following reason: \n${e}`));
      return msg.send("The tag has been deleted. It's gone. For real, it no longer exists. It's pushing up the daisies.");
    }
    case "random": {
      const row = await this.provider.getRandom("tags");
      await this.provider.update("tags", row.id, { count: row.count + 1 });
      return msg.channel.send(row.contents);
    }
    default: {
      if (!contents) {
        const rows = await this.provider.getAll("tags");
        if (rows[0] === undefined) return msg.channel.send("There is no tag available.");
        return msg.channel.send(`**List of tags**: \`\`\`${rows.map(r => r.id).join(" | ")}\`\`\``);
      }
      const row = await this.provider.get("tags", contents);
      if (!row) return msg.reply("Tag name not found.");
      await this.provider.update("tags", row.id, { count: row.count + 1 });
      return msg.channel.send(row.contents);
    }
  }
};

exports.conf = {
  enabled: true,
  selfbot: false,
  runIn: ["text", "dm", "group"],
  aliases: ["tag"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
};

exports.help = {
  name: "tags",
  description: "Server-Specific tags",
  usage: "[--add|-a|--delete|-d|random] [contents:string] [...]",
  usageDelim: " ",
};
