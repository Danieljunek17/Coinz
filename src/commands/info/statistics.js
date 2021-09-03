const { msToTime } = require("../../tools/tools");
const { MessageEmbed } = require("discord.js");
var { dependencies } = require('../../../package.json');

module.exports.execute = async (client, message, args, data) => {
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;

    const newEmbed = new MessageEmbed()
        .setAuthor(`Bot Statistics`, `${client.user.avatarURL()}`)
        .setColor("BLUE")
        .setFooter(client.config.footer)
        .setTimestamp()
        .setThumbnail(`${client.user.avatarURL()}`)
        .addFields(
            { name: 'Library', value: `discord.js${dependencies["discord.js"]}`, inline: true },
            { name: 'Uptime', value: `${msToTime(client.uptime)}`, inline: true },
            { name: 'Shard', value: `${message.guild.shardId + 1}/${client.shard.count}`, inline: true },
            { name: 'Memory Usage', value: `${Math.round(usedMemory * 100) / 100} MB`, inline: true },
            { name: 'Total Guilds', value: `${client.guilds.cache.size}`, inline: true },
            { name: 'Total Users', value: `${client.users.cache.size}`, inline: true }
        )
    await message.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "statistics",
    aliases: ["stats"],
    description: "Get information about the bot.",
    usage: ["statistics"],
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