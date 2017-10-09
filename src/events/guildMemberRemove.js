exports.run = (client, member) => {
  const modLog = member.guild.channels.get(member.guild.settings.modLog);
  if (!modLog) console.error("No modlog found.");
  const embed = new client.methods.Embed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
    .setColor(0xffcc66)
    .setFooter("User Left")
    .setTimestamp();
  modLog.send({ embed });
};
