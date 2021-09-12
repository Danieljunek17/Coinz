require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');
const util = require('util');
const readdir = util.promisify(fs.readdir);
const { Client, Collection } = require('discord.js');

const client = new Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_MESSAGES"] });

client.commands = new Collection();
client.event = new Collection();
client.slashCommands = new Collection();
client.config = require('./config.json');
client.database = require('./database/mongoose');
client.tools = require('./tools/tools');
client.tables = require('./tools/tables');
client.logger = require('./tools/logger');
client.cooldown = require('./tools/cooldown');
client.resolver = require('./tools/resolvers');

async function init() {
    // Event handler
    const eventFiles = fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`${process.cwd()}/src/events/${file}`);
        const eventName = file.split(".")[0];
        client.logger.load(`Loading event ${file}.`);
        client.on(eventName, event.bind(null, client));
    }

    // Command Handler
    let commandFolder = await readdir("./src/commands/");
    commandFolder.forEach(dir => {
        const commandFiles = fs.readdirSync('./src/commands/' + dir + "/").filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`${process.cwd()}/src/commands/${dir}/${file}`);

            try {
                client.commands.set(command.help.name, command);
            } catch (err) {
                client.logger.error(`An unexpected error occured with COMMAND ${file}.`);
            }
        }
    })

    // Slash Command Handler
    let slashCommandFolder = await readdir("./src/slashCommands/");
    slashCommandFolder.forEach(dir => {
        const slashCommandFiles = fs.readdirSync('./src/slashCommands/' + dir + "/").filter(file => file.endsWith('.js'));
        for (const file of slashCommandFiles) {
            const slashCommand = require(`${process.cwd()}/src/slashCommands/${dir}/${file}`);

            try {
                client.slashCommands.set(slashCommand.help.name, slashCommand);
            } catch (err) {
                client.logger.error(`An unexpected error occured with SLASH COMMAND ${file}.`);
            }
        }
    })

    // Connect to the database
    mongoose.connect(process.env.DATABASE_URI).then(() => {
        client.logger.ready(`Connected to MongoDB.`);
    }).catch((err) => {
        client.logger.error('Unable to connect to MongoDB Database.\nError: ' + err);
    })

    await client.login(process.env.TOKEN);
}

init();

process.on('unhandledRejection', err => {
    client.logger.error(`Unknown error occured:\n`);
    console.log(err)
})

module.exports.client = client
