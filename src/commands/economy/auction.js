const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'auction',
  description: 'Start an auction for an item — /auction <item name> <starting bid>',
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ').slice(1);
    const startBid = parseInt(parts[parts.length - 1], 10);
    const itemName = parts.slice(0, -1).join(' ');
    if (!itemName || !startBid) return ctx.reply('Usage: /auction <item name> <starting bid>');
    await ctx.reply(`🔨 Auction started for "${itemName}" — starting bid: ${startBid}${config.economy.currencySymbol}.\nUse /bid <amount> to place a bid!`);
  },
};
