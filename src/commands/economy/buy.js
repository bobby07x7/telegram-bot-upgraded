const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { SHOP_ITEMS, displayName } = require('../../database/items');

/**
 * Core purchase logic, shared between the /buy text command and the
 * inline "Buy" button (see actions/buyItem.js) so both stay in sync.
 * Returns { ok: true, item } on success or { ok: false, message } on failure.
 */
function purchaseItem(userId, itemId) {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return { ok: false, message: '❌ Item not found. Use /shop to see available items.' };

  const user = getUser(userId);
  if (user.balance < item.price) {
    return {
      ok: false,
      message: `❌ You need ${item.price}${config.economy.currencySymbol}, but only have ${user.balance}${config.economy.currencySymbol}.`,
    };
  }

  const collectionLog = user.collectionLog.includes(item.id) ? user.collectionLog : [...user.collectionLog, item.id];
  saveUser(userId, { balance: user.balance - item.price, inventory: [...user.inventory, item.id], collectionLog });
  addHistory(userId, { type: 'purchase', item: item.name, amount: -item.price });

  return { ok: true, item };
}

module.exports = {
  name: 'buy',
  description: 'Buy an item from the shop — /buy <item_id>',
  execute: async (ctx) => {
    const itemId = (ctx.message.text.split(' ')[1] || '').trim().toLowerCase();
    const result = purchaseItem(ctx.from.id, itemId);

    if (!result.ok) return ctx.reply(result.message);
    await ctx.reply(
      `✅ *Purchase complete!*\n${displayName(result.item)} has been added to your /inventory.\n💰 -${result.item.price}${config.economy.currencySymbol}`,
      { parse_mode: 'Markdown' }
    );
  },
  purchaseItem,
};
