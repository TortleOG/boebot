const ModLog = require("../../lib/structures/Modlog");

exports.run = async (client, msg, [selected, ...reason]) => {
  reason = reason.length > 0 ? reason.join(" ") : null;

  const row = await this.provider.get("modlogs", msg.guild.id);
  const log = row.modlogs[selected === "latest" ? row.modlogs.length - 1 : selected - 1];
  if (!log) return msg.send(`\`|❌|\` ${msg.author}, there are no modlogs with that case number.`);

  const channel = await msg.guild.channels.get(msg.guild.settings.modLog);
  if (!channel) return msg.send(`\`|❌|\` ${msg.author}, I could not find the modlog channel.`);

  const messages = await channel.messages.fetch({ limit: 100 });
  const message = messages.find(mes => mes.author.id === client.user.id
    && mes.embeds.length > 0
    && mes.embeds[0].type === "rich"
    && mes.embeds[0].footer
    && mes.embeds[0].footer.text === `Case ${selected === "latest" ? row.modlogs.length : selected}`);

  if (message) {
    const embed = message.embeds[0];
    const [user, mod] = embed.description.split("\n");
    embed.description = [user, mod, `**Reason**: ${reason}`].join("\n");
    await message.edit({ embed });
  } else {
    const embed = new client.methods.Embed()
      .setTitle(`User ${ModLog.title(log.type)}`)
      .setColor(ModLog.color(log.type))
      .setDescription([
        `**Member**: ${log.user.tag} | ${log.user.id}`,
        `**Moderator**: ${log.mod.tag}`,
        `**Reason**: ${reason}`,
      ].join("\n"))
      .setTimestamp()
      .setFooter(`Case ${selected === "latest" ? row.modlogs.length : selected}`, client.user.displayAvatarURL({ format: "jpg" }));
    await channel.send({ embed });
  }

  const oReason = log.reason;
  row.modlogs[selected === "latest" ? row.modlogs.length - 1 : selected - 1].reason = reason;
  await this.provider.replace("modlogs", msg.guild.id, row);

  return msg.send(`Successfully updated the log ${selected}\n${"```http\n"}${[
    `Old reason : ${oReason || "Not set."}`,
    `New reason : ${reason}`,
  ].join("\n")}${"```"}`);
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
  name: "reason",
  description: "Edit a reason on a supplied case.",
  usage: "<case:int|latest> <reason:str> [...]",
  usageDelim: " ",
  extendedHelp: "",
};
