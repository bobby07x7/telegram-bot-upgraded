const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned, REFINE_TIERS, progressDisplayName } = require('../../core/forge');
const { config } = require('../../config/config');

const REFINE_COST = 7500;

module.exports = {
  name: 'refine',
  description: 'Improve item quality: Normal → Fine → Rare → Epic → Legendary — /refine <item> (cost 7,500🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /refine <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);

    const idx = REFINE_TIERS.indexOf(progress.refine);
    if (idx >= REFINE_TIERS.length - 1) return ctx.reply(`✅ ${displayName(item)} is already at max refine (Legendary).`);
    if (user.balance < REFINE_COST) return ctx.reply(`❌ Refining costs ${REFINE_COST}${config.economy.currencySymbol}.`);

    saveUser(ctx.from.id, { balance: user.balance - REFINE_COST });
    const updated = saveProgress(ctx.from.id, item.id, { refine: REFINE_TIERS[idx + 1] });
    addHistory(ctx.from.id, { type: 'refine', item: item.name, amount: -REFINE_COST });

    await ctx.reply(`💠 *Refined!* ${progressDisplayName(item, updated)}`, { parse_mode: 'Markdown' });
  },
};
