const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const FORGE_COST = 2000;

module.exports = {
  name: 'forge',
  description: 'Unlock an item for upgrading/enchanting/refining — /forge <item> (cost 2,000🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /forge <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (progress.forged) return ctx.reply(`✅ ${displayName(item)} is already forged and ready to upgrade.`);
    if (user.balance < FORGE_COST) return ctx.reply(`❌ Forging costs ${FORGE_COST}${config.economy.currencySymbol}, you don't have enough.`);

    saveUser(ctx.from.id, { balance: user.balance - FORGE_COST });
    saveProgress(ctx.from.id, item.id, { forged: true });
    addHistory(ctx.from.id, { type: 'forge', item: item.name, amount: -FORGE_COST });

    await ctx.reply(`⚒️ *Forged!* ${displayName(item)} is now ready — use /itemupgrade, /enchant, /refine, and more on it.`, { parse_mode: 'Markdown' });
  },
};
