const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const REFORGE_COST = 10000;
const STATS = ['ATK', 'HP', 'DEF', 'CRIT', 'SPD'];

module.exports = {
  name: 'reforge',
  description: 'Reroll a random bonus stat on an item — /reforge <item> (cost 10,000🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /reforge <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);
    if (user.balance < REFORGE_COST) return ctx.reply(`❌ Reforging costs ${REFORGE_COST}${config.economy.currencySymbol}.`);

    const stat = STATS[Math.floor(Math.random() * STATS.length)];
    const value = 5 + Math.floor(Math.random() * 20);

    saveUser(ctx.from.id, { balance: user.balance - REFORGE_COST });
    saveProgress(ctx.from.id, item.id, { reforgedStat: stat, reforgedValue: value });
    addHistory(ctx.from.id, { type: 'reforge', item: item.name, amount: -REFORGE_COST });

    await ctx.reply(`🔮 *Reforged!* ${displayName(item)} rolled +${value} ${stat}.`, { parse_mode: 'Markdown' });
  },
};
