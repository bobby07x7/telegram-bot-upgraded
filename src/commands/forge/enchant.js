const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned, ENCHANTS } = require('../../core/forge');
const { config } = require('../../config/config');

const ENCHANT_COST = 5000;

module.exports = {
  name: 'enchant',
  description: 'Add a random magical ability to an item — /enchant <item> (cost 5,000🪙, replaces any existing enchant)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /enchant <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);
    if (user.balance < ENCHANT_COST) return ctx.reply(`❌ Enchanting costs ${ENCHANT_COST}${config.economy.currencySymbol}.`);

    const enchant = ENCHANTS[Math.floor(Math.random() * ENCHANTS.length)];
    saveUser(ctx.from.id, { balance: user.balance - ENCHANT_COST });
    saveProgress(ctx.from.id, item.id, { enchant: enchant.id });
    addHistory(ctx.from.id, { type: 'enchant', item: item.name, amount: -ENCHANT_COST });

    await ctx.reply(`✨ *Enchanted!* ${displayName(item)} now carries ${enchant.label}.`, { parse_mode: 'Markdown' });
  },
};
