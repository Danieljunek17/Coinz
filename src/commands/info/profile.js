const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, data) => {
    let member;
    try {
        member = args.join(" ") ? await client.resolver.getMember(args.join(" "), message.guild) : message.member;
    } catch (err) {
        return message.reply({ content: `:x: This user doesn't exist.` })
    } finally {
        if (!member) member = message.member;
    }

    let userData = await client.database.fetchUser(member.id, message.guildId);

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
    await message.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "profile",
    aliases: ["user-info", "userinfo", "memberinfo", "member-info"],
    description: "Get a lot of information about a member.",
    usage: ["profile [member]"],
    examples: ["profile @Siebe", "profile Discord#0000", "profile"],
    extraFields: [],
    image: "",
    enabled: true,
    category: "info",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}