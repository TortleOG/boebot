exports.run = (client, member) => {
  const plebRole = member.guild.roles.find("name", "Plebs");
  const modLog = member.guild.channels.get(member.guild.settings.modLog);
  if (!modLog) console.error("No modlog found.");
  const embed = new client.methods.Embed()
    .setAuthor(member.user.tag, member.user.displayAvatarURL({ format: "png" }))
    .setColor(0x99e052)
    .setFooter("User Joined")
    .setTimestamp();
  modLog.send({ embed });
  member.addRole(plebRole);
};
