module.exports.execute = async (client, message, args, data) => {
    await message.reply({ content: `**Source Code:** https://github.com/Aqua-Solutions2/Coinz` });
}

module.exports.help = {
    name: "source",
    aliases: ["sourcecode"],
    description: "View all source code online.",
    usage: ["source"],
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