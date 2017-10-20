exports.run = (client) => {
  client.user.setPresence({ activity: { name: `@BoeBot help | ${client.guilds.size} Guilds`, type: 0 } });
};
