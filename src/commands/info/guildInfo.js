const { MessageEmbed } = require("discord.js");
const userSchema = require("../../database/schemas/users");

module.exports.execute = async (client, message, args, data) => {
    const userData = await userSchema.find({ guildId: message.guildId });
    let totalMoney = 0;

    userData.forEach(user => totalMoney += user.economy.net);

    const newEmbed = new MessageEmbed()
        .setAuthor(`${message.guild}`, `${client.user.avatarURL()}`)
        .setColor("BLUE")
        .setFooter(client.config.footer)
        .setTimestamp()
        .addFields(
            { name: 'Stats', value: `**Members:** ${message.guild.memberCount}\n**Total Money:** ${data.guild.currency} ${totalMoney}`, inline: true },
            { name: 'General', value: `**Owner:** <@${message.guild.ownerId}>\n**Creation:** <t:${parseInt(message.guild.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Coinz', value: `**Prefix:** ${data.guild.prefix}\n**Currency:** ${data.guild.currency}\n**Premium Status:** ${data.guild.premium ? "__PREMIUM__" : "Free"}`, inline: true }
        )
    await message.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "serverinfo",
    aliases: ["server-info", "guildinfo", "guild-info"],
    description: "Get general information about this server.",
    usage: ["serverinfo"],
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