const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, data) => {
    let member = args.join(" ") ? await getMember(args.join(" "), message.guild) : message.member;
    if (!member) member = message.member;

    let userData = await client.database.fetchUser(member.id, message.guildId);

    const newEmbed = new MessageEmbed()
        .setAuthor(`${message.member.user.username}'s Balance.`, `${message.member.user.avatarURL()}`)
        .setColor("BLUE")
        .setFooter(client.config.footer)
        .setTimestamp()
        .addFields(
            { name: 'Cash', value: `${data.guild.currency} ${userData.economy.cash}`, inline: true },
            { name: 'Bank', value: `${data.guild.currency} ${userData.economy.bank}`, inline: true },
            { name: 'Total', value: `${data.guild.currency} ${userData.economy.cash + userData.economy.bank}`, inline: true }
        )
    await message.reply({ embeds: [newEmbed] });
}

module.exports.help = {
    name: "balance",
    aliases: ["bal", "account"],
    description: "View your account balance and see how much cash|bank|total you have.",
    usage: ["balance [member]"],
    examples: ["balance @Siebe", "balance"],
    extraFields: [],
    image: "",
    enabled: true,
    category: "economy",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}