const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { SHOP_ITEMS, displayName } = require('../../database/items');

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop — /buy <item_id>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const itemId = (ctx.message.text.split(' ')[1] || '').trim().toLowerCase();
    const item = SHOP_ITEMS.find((i) => i.id === itemId);

    if (!item) return ctx.reply('❌ Item not found. Use /shop to see available items.');

    const user = getUser(id);
    if (user.balance < item.price) {
      return ctx.reply(`❌ You need ${item.price}${config.economy.currencySymbol}, but only have ${user.balance}${config.economy.currencySymbol}.`);
    }

    saveUser(id, { balance: user.balance - item.price, inventory: [...user.inventory, item.id] });
    addHistory(id, { type: 'purchase', item: item.name, amount: -item.price });
    await ctx.reply(
      `✅ *Purchase complete!*\n${displayName(item)} has been added to your /inventory.\n💰 -${item.price}${config.economy.currencySymbol}`,
      { parse_mode: 'Markdown' }
    );
  },
};
