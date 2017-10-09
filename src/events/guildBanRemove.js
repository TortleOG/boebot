const Modlog = require("../../lib/structures/Modlog");

exports.run = (client, guild, user) => {
  new Modlog(client)
    .setType("unban")
    .setMember(user)
    .setMod(user.unbanAuth)
    .setReason(user.unbanReason)
    .send(guild);
};
