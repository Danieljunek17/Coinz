const userSchema = require("../../database/schemas/users");

module.exports.execute = async (client, message, args, data) => {
    const amount = args.join('');
    let number;

    try {
        if (amount.toLowerCase() === 'all') {
            number = data.user.economy.cash
        } else if (parseInt(amount) > data.user.economy.cash) {
            return message.reply({ content: `:x: You don't have that much money in cash. You currently have ${data.guild.currency} ${data.user.economy.cash} in cash.` });
        } else if (parseInt(amount) <= 0) {
            return message.reply({ content: `:x: You have to deposit at least ${data.guild.currency} 1.` });
        } else {
            number = parseInt(amount);
        }
    } catch (err) {
        client.logger.error(`An unexpected error occured with deposit. User Message was: ${message.content}`);
    }

    if (number === undefined) return message.reply({ content: `You need to give a valid amount. Use \`${data.guild.prefix}help deposit\`` });

    await userSchema.updateOne({ userId: message.author.id, guildId: message.guildId }, {
        $inc: {
            'economy.cash': -number,
            'economy.bank': number
        }
    });
    await message.reply({ content: `:white_check_mark: Successfully deposited ${data.guild.currency} ${number} in your bank.` });
}

module.exports.help = {
    name: "deposit",
    aliases: ["dep"],
    description: "Deposit cash into your bank account.",
    usage: ["dep <amount | all>"],
    examples: ["dep 500", "dep all"],
    extraFields: [],
    image: "",
    enabled: true,
    category: "economy",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}