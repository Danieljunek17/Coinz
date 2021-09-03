module.exports = async (client, interaction) => {
    try {
        if (interaction.member.bot) return; // Return if member is bot
        if (!interaction.guild) return; // Return if dms or group chat

        let guildData;
        if (!interaction.guild.prefix) { // Load prefix into cache 
            guildData = await client.database.fetchGuild(interaction.guildId);
            interaction.guild.prefix = guildData.prefix.toLowerCase();
        }

        //Checking if the message is a command
        const slashCmd = client.slashCommands.get(interaction.commandName);

        //If it isn't a command then return
        if (!slashCmd) return;

        //If command is owner only and author isn't owner return
        if (slashCmd.help.ownerOnly && interaction.member.id !== config.ownerId) return;

        let userPerms = [];
        //Checking for members permission
        slashCmd.help.memberPermissions.forEach((perm) => {
            if (!interaction.channel.permissionsFor(interaction.member).has(perm)) {
                userPerms.push(perm);
            }
        });
        //If user permissions arraylist length is more than one return error
        if (userPerms.length > 0) return interaction.reply("Looks like you're missing the following permissions:\n" + userPerms.map((p) => `\`${p}\``).join(", "));

        let clientPerms = [];
        //Checking for client permissions
        slashCmd.help.botPermissions.forEach((perm) => {
            if (!interaction.channel.permissionsFor(interaction.guild.me).has(perm)) {
                clientPerms.push(perm);
            }
        });
        //If client permissions arraylist length is more than one return error
        if (clientPerms.length > 0) return interaction.reply("Looks like I'm missing the following permissions:\n" + clientPerms.map((p) => `\`${p}\``).join(", "));

        if (client.cooldown.isOnCooldown(interaction.guildId, interaction.member.id)) return interaction.reply(`:x: You have to wait ${client.tools.msToTime(client.cooldown.getCooldown(interaction.guildId, interaction.member.id, slashCmd.name))} to use this command again.`);
        client.cooldown.setCooldown(interaction.guildId, interaction.member.id, slashCmd.help.name, slashCmd.help.cooldown);

        //Get the user database
        let userData = await client.database.fetchUser(interaction.member.id, interaction.guildId);
        if (!guildData) guildData = await client.database.fetchGuild(interaction.guildId);
        let data = {};
        data.user = userData;
        data.guild = guildData;
        data.cmd = slashCmd;
        data.config = client.config;

        //Execute the command
        slashCmd.execute(client, interaction, data);
    } catch (err) {
        console.error(err);
    }
}