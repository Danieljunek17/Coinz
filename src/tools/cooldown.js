var cmdCooldown = {};

function generateProperties(guildId, userId) {
    let guildCooldown = cmdCooldown[guildId];
    if (!guildCooldown) cmdCooldown[guildId] = {};

    let userCooldown = cmdCooldown[guildId][userId];
    if (!userCooldown) cmdCooldown[guildId][userId] = {};
};

module.exports.isOnCooldown = (guildId, userId, cmdName) => {
    generateProperties(guildId, userId);
    let time = cmdCooldown[guildId][userId][cmdName] || 0;

    if (time && (time > Date.now())) return true;
    else return false;
};

module.exports.removeCooldown = (guildId, userId, cmdName = undefined) => {
    generateProperties(guildId, userId);

    if (cmdName) cmdCooldown[guildId][userId][cmdName] = 0;
    else cmdCooldown[guildId][userId] = {};
};

module.exports.setCooldown = (guildId, userId, cmdName, cooldown) => {
    generateProperties(guildId, userId);
    cmdCooldown[guildId][userId][cmdName] = Date.now() + cooldown;
};

module.exports.getCooldown = (guildId, userId, cmdName) => {
    generateProperties(guildId, userId);
    let time = cmdCooldown[guildId][userId][cmdName] || 0;
    return time - Date.now();
};