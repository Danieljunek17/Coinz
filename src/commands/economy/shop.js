const { MessageActionRow, MessageButton, MessageEmbed, ButtonInteraction } = require('discord.js');
const shopInv = require('../../data/shopInventory.json');
var shop = {};  // used to cache every item in the shop
var shopSize = 0;

function getShopItems() {
    var totalShop = {};

    for (const item in shopInv) {
        if (shopInv[item]['buyPrice'] > 0) {
            totalShop[item] = shopInv[item];
        };
    };

    return totalShop;
};

function createShopEmbed(client, prefix, shopStr, currentPage, maxPages) {
    let embed = new MessageEmbed()
        .setAuthor(`Coinz Shop`)
        .setColor("BLUE")
        .setFooter(`${prefix}shop [item] to get more info about an item. ─ Page ${currentPage + 1} of ${maxPages}.`)
        .setDescription(shopStr)
    return embed;
};

function createShop(currentPage, currency, category) {
    let shopStr = "";
    let x = 0;
    for (const shopItem in shop) {
        if (x >= currentPage * 5 && x < currentPage * 5 + 5) {
            shopStr += `<:${shopItem}:${shop[shopItem]['emote']}> **${shop[shopItem]['name']}** ─ ${currency} ${shop[shopItem]['buyPrice']}\n${shop[shopItem]['shortDesc']}\n\n`
        }
        x++;
    };
    return shopStr;
};

function calculateButtons(currentPage, maxPages) {
    var disablePreviousBtn = false;
    var disableNextBtn = false;

    if (currentPage <= 0) {
        disablePreviousBtn = true;
    } else if (currentPage + 1 >= maxPages) {
        disableNextBtn = true;
    } else {
        disablePreviousBtn = false;
        disableNextBtn = false;
    }
    return [disablePreviousBtn, disableNextBtn];
};

function setButtons(disablePrevious, disableNext) {
    let row = new MessageActionRow().addComponents(
        new MessageButton()
            .setCustomId("shop_toFront")
            .setStyle("PRIMARY")
            .setEmoji("⏮")
            .setDisabled(disablePrevious),
        new MessageButton()
            .setCustomId("shop_previous")
            .setStyle("PRIMARY")
            .setEmoji("⬅️")
            .setDisabled(disablePrevious),
        new MessageButton()
            .setCustomId("shop_next")
            .setStyle("PRIMARY")
            .setEmoji("➡️")
            .setDisabled(disableNext),
        new MessageButton()
            .setCustomId("shop_toEnd")
            .setStyle("PRIMARY")
            .setEmoji("⏭")
            .setDisabled(disableNext)
    );
    return row;
};

module.exports.execute = async (client, message, args, data) => {
    const item = (args.join('')).toLowerCase();

    if (item) {
        const itemObj = shopInv[item];
        if (!itemObj) return message.reply({ content: `:x: That item does not exist.` });

        let buyPrice = shopInv[item]['buyPrice'] ? `${data.guild.currency} ${shopInv[item]['buyPrice']}` : 'This item cannot be bought in the shop.'
        let sellPrice = shopInv[item]['sellPrice'] ? `${data.guild.currency} ${shopInv[item]['sellPrice']}` : 'This item cannot be sold.'

        const newEmbed = new MessageEmbed()
            .setTitle(`${shopInv[item]['name']}`)
            .setColor("BLUE")
            .setFooter(`Item Category: ${shopInv[item]['category']}`)
            .setThumbnail(`https://cdn.discordapp.com/emojis/${shopInv[item]['emote']}.png`)
            .setDescription(`${shopInv[item]['description'] || shopInv[item]['shortDesc']}\n\n**BUY PRICE:** ${buyPrice}\n**SELL PRICE:** ${sellPrice}`)
        await message.reply({ embeds: [newEmbed] });
    } else {
        if (true) {
            shop = getShopItems();
            shopSize = Object.keys(shop).length;
        }

        const maxPages = Math.ceil(shopSize / 5);

        var currentPage = 0;
        var shopText = createShop(currentPage, data.guild.currency)
        var disableBtns = calculateButtons(currentPage, maxPages);

        const msg = await message.channel.send({ embeds: [createShopEmbed(client, data.guild.prefix, shopText, currentPage, maxPages)], components: [setButtons(disableBtns[0], disableBtns[1])] });

        const filter = (interaction) => {
            if (interaction.member.id === message.author.id) return true;
            return interaction.reply({ content: `Those buttons are not meant for you.`, ephemeral: true, target: ButtonInteraction.member })
        }

        const collector = message.channel.createMessageComponentCollector({ filter, max: 10, idle: 8000, time: 20000 });

        collector.on('collect', (ButtonInteraction) => {
            if (ButtonInteraction.customId === 'shop_toEnd') currentPage = maxPages - 1;
            else if (ButtonInteraction.customId === 'shop_toFront') currentPage = 0;
            else if (ButtonInteraction.customId === 'shop_next') currentPage++;
            else if (ButtonInteraction.customId === 'shop_previous') currentPage--;

            shopText = createShop(currentPage, data.guild.currency)
            disableBtns = calculateButtons(currentPage, maxPages);
            msg.edit({ embeds: [createShopEmbed(client, data.guild.prefix, shopText, currentPage, maxPages)], components: [setButtons(disableBtns[0], disableBtns[1])] });
            ButtonInteraction.deferUpdate();
        });

        collector.on('end', (ButtonInteraction) => {
            msg.edit({ components: [setButtons(true, true)] });
        });
    }
}

module.exports.help = {
    name: "shop",
    aliases: ["store"],
    description: "View items in the shop. To buy an item, use the `buy` command.",
    usage: ["shop [item]"],
    examples: ["shop Coinz Trophy", "shop"],
    extraFields: [],
    image: "",
    enabled: true,
    category: "economy",
    memberPermissions: [],
    botPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    ownerOnly: false,
    cooldown: 5000
}