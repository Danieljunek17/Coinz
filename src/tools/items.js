let inventory = require('../data/shopInventory.json');

module.exports.getItem = (itemId) => {
    return inventory[itemId];
};