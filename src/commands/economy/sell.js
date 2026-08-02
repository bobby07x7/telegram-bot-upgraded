const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { getItem, findItem, displayName } = require('../../database/items');

module.exports = {
  name: 'sell',
  description: 'Sell an item from your inventory for half its shop price',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const query = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    const user = getUser(id);

    if (!query) return ctx.reply('Usage: /sell <item name or id>\nCheck /inventory for what you own.');

    const item = findItem(query);
    const idx = item
      ? user.inventory.findIndex((i) => i === item.id)
      : user.inventory.findIndex((i) => String(i).toLowerCase().includes(query.toLowerCase()));

    if (idx === -1) return ctx.reply('❌ You don\'t own that item. Check /inventory.');

    const stored = user.inventory[idx];
    const meta = getItem(stored) || item;
    const sellPrice = meta?.price ? Math.floor(meta.price / 2) : 50;
    const label = meta ? displayName(meta) : stored;

    const newInventory = [...user.inventory];
    newInventory.splice(idx, 1);

    // If the sold item was equipped, unequip it first.
    const equipped = { ...(user.equipped || {}) };
    for (const slot of Object.keys(equipped)) {
      if (equipped[slot] === stored) equipped[slot] = null;
    }

    saveUser(id, { balance: user.balance + sellPrice, inventory: newInventory, equipped });
    addHistory(id, { type: 'sold item', item: label, amount: sellPrice });
    await ctx.reply(`✅ Sold ${label} for ${sellPrice}${config.economy.currencySymbol}.`);
  },
};
