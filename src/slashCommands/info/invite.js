module.exports.execute = async (client, interaction, data) => {
    await interaction.reply({ content: `**Invite URL:** <https://www.coinzbot.xyz/invite>` });
}

module.exports.help = {
    name: "invite",
    description: "Get a link to invite the bot.",
    options: [],
    enabled: true,
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}