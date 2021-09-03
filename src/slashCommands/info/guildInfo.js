const { MessageEmbed } = require("discord.js");
const userSchema = require("../../database/schemas/users");

module.exports.execute = async (client, interaction, data) => {
    const userData = await userSchema.find({ guildId: interaction.guildId });
    let totalMoney = 0;

    userData.forEach(user => totalMoney += user.economy.net);

    const newEmbed = new MessageEmbed()
        .setAuthor(`${interaction.guild}`, `${client.user.avatarURL()}`)
        .setColor("BLUE")
        .setFooter(client.config.footer)
        .setTimestamp()
        .addFields(
            { name: 'Stats', value: `**Members:** ${interaction.guild.memberCount}\n**Total Money:** ${data.guild.currency} ${totalMoney}`, inline: true },
            { name: 'General', value: `**Owner:** <@${interaction.guild.ownerId}>\n**Creation:** <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:R>`, inline: true },
            { name: 'Coinz', value: `**Prefix:** ${data.guild.prefix}\n**Currency:** ${data.guild.currency}\n**Premium Status:** ${data.guild.premium ? "__PREMIUM__" : "Free"}`, inline: true }
        )
    await interaction.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "serverinfo",
    description: "Get general information about this server.",
    options: [],
    enabled: true,
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}