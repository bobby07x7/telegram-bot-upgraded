const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned, EVOLUTION_PREFIXES, progressDisplayName, MAX_LEVEL } = require('../../core/forge');
const { config } = require('../../config/config');

const EVOLVE_COST = 50000;

module.exports = {
  name: 'evolve',
  description: 'Evolve a maxed-out item to its next form (Ancient → Celestial → Infinity) — /evolve <item> (cost 50,000🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /evolve <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);
    if (progress.level < MAX_LEVEL) return ctx.reply(`⚠️ ${displayName(item)} must be +${MAX_LEVEL} before it can evolve (currently +${progress.level}).`);
    if (progress.stage >= EVOLUTION_PREFIXES.length - 1) return ctx.reply(`✅ ${displayName(item)} has reached its final evolution.`);
    if (user.balance < EVOLVE_COST) return ctx.reply(`❌ Evolving costs ${EVOLVE_COST}${config.economy.currencySymbol}.`);

    saveUser(ctx.from.id, { balance: user.balance - EVOLVE_COST });
    const updated = saveProgress(ctx.from.id, item.id, { stage: progress.stage + 1, level: 0 });
    addHistory(ctx.from.id, { type: 'evolve', item: item.name, amount: -EVOLVE_COST });

    await ctx.reply(`🧬 *Evolved!* ${progressDisplayName(item, updated)}\n(Level reset to +0 — start upgrading the new form!)`, { parse_mode: 'Markdown' });
  },
};
