const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const REFUND_PERCENT = 0.3;

module.exports = {
  name: 'dismantle',
  description: 'Destroy an item for a partial coin refund — /dismantle <item> (free, locked items are protected)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /dismantle <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (progress.locked) return ctx.reply(`🔒 ${displayName(item)} is locked. Use /itemlock ${item.id} to unlock it first.`);

    const refund = Math.floor((item.price || 0) * REFUND_PERCENT);
    const inventory = [...user.inventory];
    inventory.splice(inventory.indexOf(item.id), 1);

    saveUser(ctx.from.id, { balance: user.balance + refund, inventory });
    addHistory(ctx.from.id, { type: 'dismantle', item: item.name, amount: refund });

    await ctx.reply(`♻️ *Dismantled.* ${displayName(item)} was broken down for ${refund}${config.economy.currencySymbol}.`, { parse_mode: 'Markdown' });
  },
};
