const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'exchange',
  description: 'Exchange an unwanted item for gacha currency (half its rarity value)',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const query = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    const user = getUser(id);
    const idx = user.inventory.findIndex((i) => i.toLowerCase().includes(query.toLowerCase()));

    if (!query || idx === -1) return ctx.reply('Usage: /exchange <item name>');
    const valueMap = { common: 20, uncommon: 50, rare: 120, epic: 300, legendary: 800 };
    const rarityKey = config.gacha.rarities.find((r) => user.inventory[idx].startsWith(r.emoji))?.key || 'common';
    const value = valueMap[rarityKey];

    const newInv = [...user.inventory];
    const itemName = newInv.splice(idx, 1)[0];
    saveUser(id, { balance: user.balance + value, inventory: newInv });
    await ctx.reply(`♻️ Exchanged ${itemName} for ${value}${config.economy.currencySymbol}.`);
  },
};
