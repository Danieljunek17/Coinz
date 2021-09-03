const userSchema = require("../../database/schemas/users");

module.exports.execute = async (client, message, args, data) => {
    const amount = args.join('');
    let number;

    try {
        if (amount.toLowerCase() === 'all') {
            number = data.user.economy.bank
        } else if (parseInt(amount) > data.user.economy.bank) {
            return message.reply({ content: `:x: You don't have that much money in your bank. You currently have ${data.guild.currency} ${data.user.economy.cash} in your bank.` });
        } else if (parseInt(amount) <= 0) {
            return message.reply({ content: `:x: You have to withdraw at least ${data.guild.currency} 1.` });
        } else {
            number = parseInt(amount);
        }
    } catch (err) {
        client.logger.error(`An unexpected error occured with withdraw. User Message was: ${message.content}`);
    }

    if (number === undefined) return message.reply({ content: `You need to give a valid amount. Use \`${data.guild.prefix}help withdraw\`` });

    await userSchema.updateOne({ userId: message.author.id, guildId: message.guildId }, {
        $inc: {
            'economy.cash': number,
            'economy.bank': -number
        }
    });
    await message.reply({ content: `:white_check_mark: Successfully withdrawn ${data.guild.currency} ${number} from your bank.` });
}

module.exports.help = {
    name: "withdraw",
    aliases: ["with"],
    description: "Withdraw cash from your bank account.",
    usage: ["with <amount | all>"],
    examples: ["with 500", "with all"],
    extraFields: [],
    image: "",
    enabled: true,
    category: "economy",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}