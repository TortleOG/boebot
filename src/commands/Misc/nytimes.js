const validTypes = {
  "top stories": "getTopStories",
  newswire: "getNewswire",
  reviews: "getMovieReview",
};

exports.run = async (client, msg, [type, num = 0]) => {
  if (!validTypes[type]) return msg.send("`❌` | You did not select a valid type. Please try again or type `?help nytimes` for more information.");
  if (num < 0) return msg.send("`❌` | Result number cannot be a negative number.");
  const { section, func } = await this.getValidType(msg, type);
  const { res, length } = await this.getData(msg, section, func, num);
  if (num >= length) num = length - 1;
  const embed = new client.methods.Embed()
    .setAuthor("New York Times")
    .setDescription([
      `**__${res.title || res.headline}__**`,
      `${res.abstract || res.summary_short}${type === "reviews" ? `\n**Critics Pick**: ${res.critics_pick === 1 ? "Yes" : "No"}` : ""}`,
      `[${type !== "reviews" ? "Read More" : res.link.suggested_link_text}](${res.url || res.link.url})`,
    ].join("\n"))
    .setFooter(`Result ${num + 1} / ${length}`)
    .setTimestamp();
  return msg.send({ embed });
};

exports.getValidType = async (msg, type) => {
  let section;
  switch (type) {
    case "top stories":
      section = await msg.prompt("**Section**? *Default: home*.", 10000);
      if (section === null) section = "home";
      break;
    case "newswire":
      section = await msg.prompt("**Source**, **Section**, **Limit**? *Defaults: all, all, 10*", 10000);
      if (section === null) section = "all, all, 10";
      break;
    case "reviews":
      section = await msg.prompt("**Movie**?", 10000);
      break;
    // This will never happen
    default:
      break;
  }
  const func = validTypes[type];
  return { section: type === "newswire" ? section.split(", ") : section, func };
};

exports.getData = async (msg, section, func, num) => {
  if (Array.isArray(section)) {
    if (!msg.client.NYTimes.validSections.includes(section[1])) return msg.send(`\`❌\` | You did not select a valid section. Valid sections are:\`\`\`${msg.client.NYTimes.validSections.join(" | ")}\`\`\``);
    const res = await msg.client.NYTimes[func](section[0], section[1], section[2]);
    if (num >= res.results.length) num = res.results.length - 1;
    return { res: res.results[num], length: res.results.length };
  }
  if (func === "getTopStories" && !msg.client.NYTimes.validSections.includes(section)) return msg.send(`\`❌\` | You did not select a valid section. Valid sections are:\`\`\`${msg.client.NYTimes.validSections.join(" | ")}\`\`\``);
  const res = await msg.client.NYTimes[func](section);
  if (num >= res.results.length) num = res.results.length - 1;
  return { res: res.results[num], length: res.results.length };
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["nyt"],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "nytimes",
  description: "Grabs information form the NYTimes API",
  usage: "<type:str> [num:int]",
  usageDelim: ", ",
  extendedHelp: [
    "Example :: m!nytimes top stories, 5",
    "\n'top stories' is the part of the API we are requesting. The options are: ",
    "- top stories (Gets top stories from NYTimes)\n- reviews (Gets movie reviews)\n- newswire (Gets the most recent articles)",
    "\n'5' is the result number we are getting. This is an optional argument, if none is supplied, the first result will be returned.",
  ].join("\n"),
};
