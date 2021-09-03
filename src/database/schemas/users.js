const mongoose = require('mongoose');

module.exports = mongoose.model("user", new mongoose.Schema({
    userId: { type: String, require: true },
    guildId: { type: String, require: true },
    economy: {
        cash: { type: Number, require: true, default: 0 },
        bank: { type: Number, require: true, default: 0 },
        net: { type: Number, require: true, default: 0 }
    },
    job: { type: String, require: true, default: "unemployed", lowercase: true },
    experience: { type: Number, require: true, default: 0 },
    social: {
        followers: { type: Number, require: true, default: 0 },
        likes: { type: Number, require: true, default: 0 },
        comments: { type: Array, require: true, default: [] }
    },
    activePerks: { type: Array, require: true, default: [] },
    inventory: { type: Array, require: true, default: [] }
}));