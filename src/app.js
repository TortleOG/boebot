const settings = !process.env.PRODUCTION ? require("../settings") : null;
const BoeBot = require("./lib/Boebot");

// Client stuff
const client = new BoeBot(settings ? settings.clientConfig : {
  ownerID: "157246404388061184",
  prefix: "?",
  provider: { engine: "sqlite" },
  clientOptions: {
    fetchAllMembers: true,
  },
});

client.login(settings ? settings.token : process.env.TOKEN);

String.prototype.capitalize = function() { // eslint-disable-line
  return this.charAt(0).toUpperCase() + this.slice(1);
};
