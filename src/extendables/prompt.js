exports.conf = {
  type: "method",
  method: "prompt",
  appliesTo: ["Message"],
};

// eslint-disable-next-line func-names
exports.extend = async function (query, ms = 30000) {
  this.channel.send(query);
  const resp = await this.channel.awaitMessages(m => m.author.id === this.author.id, { max: 1, time: ms });
  if (!resp.first()) return null;
  return resp.first().content.toLowerCase();
};
