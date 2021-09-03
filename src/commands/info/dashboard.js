const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, data) => {
    let newEmbed = new MessageEmbed()
        .setAuthor(`All Links`, `${client.user.avatarURL()}`)
        .setColor("BLUE")
        .setDescription("[**Website**](https://www.coinzbot.xyz/) | [**Dashboard**](https://www.coinzbot.xyz/dashboard/) | [**Docs**](https://docs.coinzbot.xyz/)")
        .setFooter(client.config.footer)
    await message.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "dashboard",
    aliases: ["website", "dash"],
    description: "Get a link to visit our dashboard.",
    usage: ["dashboard"],
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