const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, interaction, data) => {
    let newEmbed = new MessageEmbed()
        .setAuthor(`All Links`, `${client.user.avatarURL()}`)
        .setColor("BLUE")
        .setDescription("[**Website**](https://www.coinzbot.xyz/) | [**Dashboard**](https://www.coinzbot.xyz/dashboard/) | [**Docs**](https://docs.coinzbot.xyz/)")
        .setFooter(client.config.footer)
    await interaction.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "dashboard",
    description: "Get a link to visit our dashboard.",
    options: [],
    enabled: true,
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}