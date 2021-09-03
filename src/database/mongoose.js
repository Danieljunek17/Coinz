const userSchema = require("./schemas/users.js");
const guildSchema = require("./schemas/guilds.js");

// Create/find users collection
module.exports.fetchUser = async function (user, guild) {

    let userDb = await userSchema.findOne({ userId: user });
    if (userDb) {
        return userDb;
    } else {
        userDb = new userSchema({
            userId: user,
            guildId: guild
        })
        await userDb.save().catch(err => console.log(err));
        return userDb;
    }
};

// Create/find guilds collection
module.exports.fetchGuild = async function (key) {

    let guildDb = await guildSchema.findOne({ guildId: key });

    if (guildDb) {
        return guildDb;
    } else {
        guildDb = new guildSchema({
            guildId: key
        })
        await guildDb.save().catch(err => console.log(err));
        return guildDb;
    }
};