const config = require("../config.json");

module.exports = async (client, message) => {
    try {
        if (message.author.bot) return; // Return if author is bot
        if (!message.guild) return; // Return if dms or group chat

        let guildData;
        if (!message.guild.prefix) { // Load prefix into cache 
            guildData = await client.database.fetchGuild(message.guild.id);
            message.guild.prefix = guildData.prefix.toLowerCase();
        }

        // Define prefix as variable
        let prefix = message.guild.prefix;

        //Check if message mentions bot only
        if (message.content === `<@!${message.client.user.id}>` || message.content === `<@${message.client.user.id}>`) {
            return message.reply({ content: `Uh-Oh! You forgot the prefix? It's \`${prefix}\``, allowedMentions: { repliedUser: true } });
        }

        // Return if it doesn't start with prefix
        if (!message.content.toLowerCase().startsWith(prefix)) return;

        //Checking if the message is a command
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const cmd = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

        //If it isn't a command then return
        if (!cmd) return;

        //If command is owner only and author isn't owner return
        if (cmd.help.ownerOnly && message.author.id !== config.ownerId) return;

        let userPerms = [];
        //Checking for members permission
        cmd.help.memberPermissions.forEach((perm) => {
            if (!message.channel.permissionsFor(message.member).has(perm)) {
                userPerms.push(perm);
            }
        });
        //If user permissions arraylist length is more than one return error
        if (userPerms.length > 0) return message.reply("Looks like you're missing the following permissions:\n" + userPerms.map((p) => `\`${p}\``).join(", "));

        let clientPerms = [];
        //Checking for client permissions
        cmd.help.botPermissions.forEach((perm) => {
            if (!message.channel.permissionsFor(message.guild.me).has(perm)) {
                clientPerms.push(perm);
            }
        });
        //If client permissions arraylist length is more than one return error
        if (clientPerms.length > 0) return message.reply("Looks like I'm missing the following permissions:\n" + clientPerms.map((p) => `\`${p}\``).join(", "));

        if (client.cooldown.isOnCooldown(message.guildId, message.author.id)) return message.channel.send(`:x: You have to wait ${client.tools.msToTime(client.cooldown.getCooldown(message.guildId, message.author.id, cmd.name))} to use this command again.`);
        client.cooldown.setCooldown(message.guildId, message.author.id, cmd.help.name, cmd.help.cooldown);

        //Get the user database
        let userData = await client.database.fetchUser(message.author.id, message.guildId);
        if (!guildData) guildData = await client.database.fetchGuild(message.guildId);
        let data = {};
        data.user = userData;
        data.guild = guildData;
        data.cmd = cmd;
        data.config = config;

        //Execute the command
        cmd.execute(client, message, args, data);
    } catch (err) {
        console.error(err);
    }
};