const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const REPAIR_COST = 250;

module.exports = {
  name: 'repair',
  description: "Restore an item's durability to 100% — /repair <item> (cost 250🪙)",
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /repair <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (progress.durability >= 100) return ctx.reply(`✅ ${displayName(item)} is already at full durability (100/100).`);
    if (user.balance < REPAIR_COST) return ctx.reply(`❌ Repairing costs ${REPAIR_COST}${config.economy.currencySymbol}.`);

    const before = progress.durability;
    saveUser(ctx.from.id, { balance: user.balance - REPAIR_COST });
    saveProgress(ctx.from.id, item.id, { durability: 100 });
    addHistory(ctx.from.id, { type: 'repair', item: item.name, amount: -REPAIR_COST });

    await ctx.reply(`🛠️ *Repaired!* ${displayName(item)} durability: ${before}/100 → 100/100`, { parse_mode: 'Markdown' });
  },
};
