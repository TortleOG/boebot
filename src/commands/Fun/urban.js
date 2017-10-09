exports.run = async (client, msg, [search, resultNum = 0]) => {
  const snekfetch = require("snekfetch");
  try {
    const { body } = await snekfetch.get(`http://api.urbandictionary.com/v0/define?term=${search}`);
    if (resultNum > 1) resultNum -= 1;
    const result = body.list[resultNum];
    if (!result) throw new Error("No entry found.");
    const wdef = result.definition.length > 1000
      ? `${this.splitText(result.definition, 1000)}...`
      : result.definition;
    const definition = [
      `**Word:** ${search}`,
      "",
      `**Definition:** ${resultNum += 1} out of ${body.list.length}\n_${wdef}_`,
      "",
      `**Example:**\n${result.example}`,
      `<${result.permalink}>`,
    ].join("\n");
    await msg.channel.send(definition);
  } catch (e) {
    msg.channel.send("`❌` | Oops! No entry was found. Please try again!");
  }
};

exports.splitText = (string, length, endBy = " ") => {
  const x = string.substring(0, length).lastIndexOf(endBy);
  const pos = x === -1 ? length : x;
  return string.substring(0, pos);
};

exports.conf = {
  enabled: true,
  runIn: ["text", "dm", "group"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["snekfetch"],
  cooldown: 5,
};

exports.help = {
  name: "urban",
  description: "Searches the Urban Dictionary library for a definition to the search term.",
  usage: "<search:str> [resultNum:int]",
  usageDelim: ", ",
};
