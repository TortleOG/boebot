exports.run = async (client, msg, [action]) => {
  const ms = require("ms");
  const time = action;
  try {
    if (!client.lockit) client.lockit = [];
    const validUnlocks = ["release", "unlock"];
    if (!action) return msg.reply("You must set a duration for the lockdown in either hours, minutes or seconds");

    if (validUnlocks.includes(time)) {
      await msg.channel.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: null,
      });
      msg.channel.send("Lockdown lifted.");
      clearTimeout(client.lockit[msg.channel.id]);
      delete client.lockit[msg.channel.id];
    } else {
      await msg.channel.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: false,
      });
      await msg.channel.send(`Channel locked down for ${ms(ms(time), { long: true })}`);
      client.lockit[msg.channel.id] = setTimeout(async () => {
        await msg.channel.overwritePermissions(msg.guild.id, {
          SEND_MESSAGES: null,
        });
        msg.channel.send("Lockdown lifted.");
        delete client.lockit[msg.channel.id];
      }, ms(time));
    }
  } catch (err) {
    msg.channel.send(`:x: ${msg.author} | It seems an error has occured. Please contact the bot owner for support.`);
    console.log(err);
  }
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: ["lock"],
  permLevel: 2,
  botPerms: [],
  requiredFuncs: [],
  requiredModules: ["ms"],
  cooldown: 5,
};

exports.help = {
  name: "lockdown",
  description: "Enables a lockdown in the text channel",
  usage: "<action:str>",
  usageDelim: "",
  extendedHelp: "",
};
