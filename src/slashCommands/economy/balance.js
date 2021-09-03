const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, interaction, data) => {
    let member = interaction.options.getMember('member');
    if (!member) member = interaction.member;

    let userData = await client.database.fetchUser(member.id, interaction.guildId);

    const newEmbed = new MessageEmbed()
        .setAuthor(`${member.user.username}'s Balance.`, `${member.user.avatarURL()}`)
        .setColor("BLUE")
        .setFooter(client.config.footer)
        .setTimestamp()
        .addFields(
            { name: 'Cash', value: `${data.guild.currency} ${userData.economy.cash}`, inline: true },
            { name: 'Bank', value: `${data.guild.currency} ${userData.economy.bank}`, inline: true },
            { name: 'Total', value: `${data.guild.currency} ${userData.economy.cash + userData.economy.bank}`, inline: true }
        )
    await interaction.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "balance",
    description: "View your account balance and see how much cash|bank|total you have.",
    options: [
        {
            name: 'member',
            type: 'USER',
            description: 'The balance of the member you want to view.',
            required: false
        }
    ],
    enabled: true,
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}