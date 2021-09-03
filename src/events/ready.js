module.exports = async (client) => {
    var data = [];

    client.slashCommands.forEach(slashCommand => {
        let commandObject = {
            name: slashCommand.help.name,
            description: slashCommand.help.description || "No Description Provided.",
            options: slashCommand.help.options
        };
        data.push(commandObject);
    });
    // await client.application?.commands.set(data);  // Used to set slash commands globally [Can take several hours to update.]

    // Debug Code to quickly set slash commands in test server.
    await client.guilds.cache.get("739810780735602758")?.commands.set(data);

    client.user.setPresence({ activities: [{ name: 'Elon Musk.', type: "WATCHING" }], status: "online" });
    client.logger.ready(`Shard ${client.shard.ids[0]} loaded.`)
}