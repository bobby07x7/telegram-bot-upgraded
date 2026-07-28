const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const IMPRINT_COST = 30000;
const IMPRINT_XP_BONUS = 100;

module.exports = {
  name: 'imprint',
  description: 'Permanently bind an item to you for a one-time XP bonus and a lock — /imprint <item> (cost 30,000🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /imprint <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (progress.imprinted) return ctx.reply(`✅ ${displayName(item)} is already imprinted to you.`);
    if (user.balance < IMPRINT_COST) return ctx.reply(`❌ Imprinting costs ${IMPRINT_COST}${config.economy.currencySymbol}.`);

    saveUser(ctx.from.id, { balance: user.balance - IMPRINT_COST, xp: user.xp + IMPRINT_XP_BONUS });
    saveProgress(ctx.from.id, item.id, { imprinted: true, locked: true });
    addHistory(ctx.from.id, { type: 'imprint', item: item.name, amount: -IMPRINT_COST });

    await ctx.reply(`👑 *Imprinted!* ${displayName(item)} is now permanently bound to you (+${IMPRINT_XP_BONUS} XP, auto-locked).`, { parse_mode: 'Markdown' });
  },
};
