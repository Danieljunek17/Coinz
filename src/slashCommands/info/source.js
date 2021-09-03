module.exports.execute = async (client, interaction, data) => {
    await interaction.reply({ content: `**Source Code:** https://github.com/Aqua-Solutions2/Coinz` });
}

module.exports.help = {
    name: "source",
    description: "View all source code online.",
    options: [],
    enabled: true,
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}