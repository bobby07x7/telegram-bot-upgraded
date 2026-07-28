const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned, MAX_LEVEL, LEVEL_SAFE_THRESHOLD, progressDisplayName } = require('../../core/forge');
const { config } = require('../../config/config');

module.exports = {
  name: 'itemupgrade',
  description: 'Increase an item\'s level, +0 to +20 — /itemupgrade <item> (cost scales with level, risk of failure after +10)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /itemupgrade <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);
    if (progress.level >= MAX_LEVEL) return ctx.reply(`✅ ${displayName(item)} is already at max level (+${MAX_LEVEL}).`);

    const cost = 500 * (progress.level + 1);
    if (user.balance < cost) return ctx.reply(`❌ Upgrading to +${progress.level + 1} costs ${cost}${config.economy.currencySymbol}.`);

    // Failure chance kicks in above +10, growing with each level past it.
    const overSafe = Math.max(0, progress.level + 1 - LEVEL_SAFE_THRESHOLD);
    const failChance = Math.min(0.6, overSafe * 0.08);
    const success = Math.random() >= failChance;

    saveUser(ctx.from.id, { balance: user.balance - cost });
    addHistory(ctx.from.id, { type: 'upgrade', item: item.name, amount: -cost });

    if (success) {
      const updated = saveProgress(ctx.from.id, item.id, { level: progress.level + 1 });
      await ctx.reply(`⬆️ *Success!* ${progressDisplayName(item, updated)}`, { parse_mode: 'Markdown' });
    } else {
      await ctx.reply(`💥 *Upgrade failed!* ${displayName(item)} stays at +${progress.level}. Coins spent, no refund.`, { parse_mode: 'Markdown' });
    }
  },
};
