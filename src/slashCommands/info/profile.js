const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, interaction, data) => {
    let member = interaction.options.getMember('member');
    if (!member) member = interaction.member;

    let userData = await client.database.fetchUser(member.id, interaction.guildId);

    const userLevel = client.tools.calcLvl(userData.experience);

    const newEmbed = new MessageEmbed()
        .setAuthor(`User info of ${member.user.username}`, `${member.user.avatarURL()}`)
        .setThumbnail(`${member.user.avatarURL({ dynamic: true })}`)
        .setColor(member.displayColor)
        .setFooter(client.config.footer)
        .setTimestamp()
        .addFields(
            { name: 'Level Stats', value: `**Level:** ${userLevel}\n**Experience:** \`${userData.experience}/${userLevel * 100 + 100}\`\n\`${client.tools.progressBar(userData.experience % 100, 100, 7)}\``, inline: false },
            { name: 'Money', value: `** Cash:** ${data.guild.currency} ${userData.economy.cash}\n ** Bank:** ${data.guild.currency} ${userData.economy.bank}\n ** Net:** ${data.guild.currency} ${userData.economy.net}`, inline: true },
            { name: 'Social', value: `** Followers:** ${userData.social.followers}\n ** Likes:** ${userData.social.likes}\n ** Unread Comments:** ${userData.social['comments'].length}`, inline: true }
        );
    await interaction.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "profile",
    description: "Get a lot of information about a member.",
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