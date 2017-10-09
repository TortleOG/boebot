/* eslint-disable no-restricted-globals */

exports.run = async (client, msg, [vol = null]) => {
  if (!msg.guild.voiceConnection) {
    throw `I am not connected in a voice channel, please add some songs to the queue first with ${msg.guild.settings.prefix}add`;
  }
  const handler = client.queue.get(msg.guild.id);
  if (!handler || handler.playing === false) throw "I am not playing music.";

  const { dispatcher } = msg.guild.voiceConnection;

  if (!vol) return msg.send(`📢 Volume: ${Math.round(dispatcher.volume * 50)}%`);
  if (!isNaN(vol)) {
    vol = parseInt(vol);
    if (vol < 0 || vol > 100) return msg.send(`📢 Volume: ${Math.round(dispatcher.volume * 50)}%`);
    if (Math.round(dispatcher.volume * 50) >= 100) return msg.send(`📢 Volume: ${Math.round(dispatcher.volume * 50)}%`);
    if (Math.round(dispatcher.volume * 50) <= 0) return msg.send(`🔇 Volume: ${Math.round(dispatcher.volume * 50)}%`);
    dispatcher.setVolume(vol / 50);
    return msg.send(`${vol > dispatcher.volume * 50 ? (dispatcher.volume === 2 ? "📢" : "🔊") : (dispatcher.volume === 0 ? "🔇" : "🔉")} Volume: ${Math.round(dispatcher.volume * 50)}%`); // eslint-disable-line
  }
  return null;
};

exports.conf = {
  enabled: true,
  runIn: ["text"],
  aliases: [],
  permLevel: 0,
  botPerms: [],
  requiredFuncs: [],
  cooldown: 5,
};

exports.help = {
  name: "volume",
  description: "Manage the volume for current song.",
  usage: "[control:str]",
  usageDelim: "",
  extendedHelp: [],
};
