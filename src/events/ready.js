const Dashboard = require("../lib/dashboard/Dashboard");

exports.run = (client) => {
  new Dashboard(client).start();
  client.user.setPresence({ activity: { name: `@BoeBot help | ${client.guilds.size} Guilds`, type: 0 } });
};
