const { msToTime } = require("../../tools/tools");

module.exports.execute = async (client, message, args, data) => {
    let msg = await message.reply({ content: `:radio_button: Calculating...` });
    await msg.edit({ content: `:ping_pong: **Ping:** ${client.ws.ping} ms\n:speech_balloon: **Responds Time:** ${msg.createdTimestamp - message.createdTimestamp} ms\n:white_check_mark: **Uptime:** ${msToTime(client.uptime)}` });
}

module.exports.help = {
    name: "ping",
    aliases: ["uptime"],
    description: "Get the latency in milliseconds and the uptime of the bot.",
    usage: ["ping"],
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