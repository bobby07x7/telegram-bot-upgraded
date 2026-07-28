const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName, ITEMS } = require('../../database/items');
const { requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const TRANSMUTE_COST = 20000;

module.exports = {
  name: 'transmute',
  description: 'Convert an item into a random different item of the same rarity — /transmute <item> (cost 20,000🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /transmute <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");
    if (user.balance < TRANSMUTE_COST) return ctx.reply(`❌ Transmuting costs ${TRANSMUTE_COST}${config.economy.currencySymbol}.`);

    const pool = Object.values(ITEMS).filter((i) => i.rarity === item.rarity && i.id !== item.id);
    if (!pool.length) return ctx.reply('❌ No other items share this rarity yet — nothing to transmute into.');

    const result = pool[Math.floor(Math.random() * pool.length)];
    const inventory = [...user.inventory];
    inventory.splice(inventory.indexOf(item.id), 1, result.id);

    saveUser(ctx.from.id, { balance: user.balance - TRANSMUTE_COST, inventory });
    addHistory(ctx.from.id, { type: 'transmute', item: `${item.name}->${result.name}`, amount: -TRANSMUTE_COST });

    await ctx.reply(`📜 *Transmuted!* ${displayName(item)} became ${displayName(result)}!`, { parse_mode: 'Markdown' });
  },
};
