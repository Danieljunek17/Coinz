const { MessageEmbed } = require("discord.js");
const randomName = require("node-random-name");

module.exports.execute = async (client, message, args, data) => {
    const name = randomName({ first: true });
    const payout = client.tools.getRandomNumber(1, 5);

    const newEmbed = new MessageEmbed()
        .setAuthor(`${message.author.username}'s Balance.`, `${message.author.avatarURL()}`)
        .setColor("BLUE")
        .setDescription(`You were begging very hard and ${name} gave you ${data.guild.currency} ${payout}.`)
        .setFooter(client.config.footer)
        .setTimestamp()
    await message.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "beg",
    aliases: [],
    description: "Beg money from other people. You probably won't get rich only asking people for money.",
    usage: ["beg"],
    examples: [],
    extraFields: [],
    image: "",
    enabled: true,
    category: "economy",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 90000
}