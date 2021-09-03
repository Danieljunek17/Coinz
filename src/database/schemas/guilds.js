const mongoose = require('mongoose');
const config = require('../../config.json');

module.exports = mongoose.model("guild", new mongoose.Schema({
    guildId: { type: String, require: true },
    prefix: { type: String, require: true, default: config.defaultPrefix },
    currency: { type: String, require: true, default: config.defaultCurrency },
    premium: { type: Boolean, require: true, default: false }
}));