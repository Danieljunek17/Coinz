module.exports.execute = async (client, message, args, data) => {
    await message.reply({ content: `**Invite URL:** <https://www.coinzbot.xyz/invite>` });
}

module.exports.help = {
    name: "invite",
    aliases: [],
    description: "Get a link to invite the bot.",
    usage: ["invite"],
    examples: [],
    extraFields: [],
    image: "",
    enabled: true,
    category: "info",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}