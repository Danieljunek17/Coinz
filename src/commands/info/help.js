const { MessageEmbed } = require("discord.js");

function createCommandEmbed(client, data, command) {
    let embed = new MessageEmbed()
        .setAuthor(`Help: ${command.name}`, `${client.user.avatarURL()}`)
        .setColor("BLUE")
        .setFooter(client.config.footer)
        .setDescription(command.description || "No Description.")
        .addField('Command Usage', `\`${data.guild.prefix}${command.usage}\``, false)

    if ((command.aliases).length) {
        let aliases = [];

        for (const alias in command.aliases) {
            aliases.push(`\`${alias}\``)
        };

        if (aliases.length) embed.addField("Aliases", aliases.join(", "), false)
    };

    if ((command.extraFields).length) {
        for (const field in command.extraFields) {
            let value = field['value']
            value = value.replace("%currency%", `${data.guild.currency}`)
            embed.addField(field['name'], value, false)
        };
    };

    return embed;
};

module.exports.execute = async (client, message, args, data) => {
    if (!args) {
        var commandName = args.join("");

        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

        if (!cmd) {
            return message.reply({ content: `That command was not found.` })
        }

        const helpEmbed = createCommandEmbed(client, data, cmd.help);
        await message.reply({ embeds: [helpEmbed] });
    } else {
        let categories = ["Info", "Economy", "Minigame"];

        let helpEmbed = new MessageEmbed()
            .setAuthor(`Help`, `${client.user.avatarURL()}`)
            .setColor("BLUE")
            .setFooter(client.config.footer)
            .setDescription(`Command Usage: \`${data.guild.prefix}help [command]\``)

        if (client.commands) {
            categories.forEach(categoryName => {
                let allCommands = [];

                client.commands.forEach(cmd => {
                    if ((cmd.help.category).toLowerCase() == categoryName.toLowerCase()) allCommands.push(`\`${cmd.help.name}\``);
                });

                if (allCommands.length) helpEmbed.addField(`${categoryName} Commands`, allCommands.join(", "), false);
            });
        };

        return await message.reply({ embeds: [helpEmbed] });
    }
}

module.exports.help = {
    name: "help",
    aliases: [],
    description: "View all commands or view a specific command.",
    usage: ["help [command]"],
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