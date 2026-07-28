const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const FUSE_COST = 15000;

module.exports = {
  name: 'fuse',
  description: 'Combine two owned items into a fused flavor variant — /fuse <item1> | <item2> (cost 15,000🪙, consumes item2)',
  execute: async (ctx) => {
    const raw = ctx.message.text.split(' ').slice(1).join(' ');
    const [q1, q2] = raw.split('|').map((s) => (s || '').trim());
    if (!q1 || !q2) return ctx.reply('⚠️ Usage: /fuse <item1> | <item2>\nExample: /fuse sword | wsword');

    const item1 = findItem(q1);
    const item2 = findItem(q2);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item1) || !requireOwned(user, item2)) return ctx.reply("❌ You don't own both of those items.");
    if (item1.id === item2.id) return ctx.reply('❌ Pick two different items to fuse.');

    const progress = getProgress(user, item1.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge ${item1.name} first — /forge ${item1.id}`);
    if (user.balance < FUSE_COST) return ctx.reply(`❌ Fusion costs ${FUSE_COST}${config.economy.currencySymbol}.`);

    const inventory = [...user.inventory];
    inventory.splice(inventory.indexOf(item2.id), 1); // consume item2

    saveUser(ctx.from.id, { balance: user.balance - FUSE_COST, inventory });
    saveProgress(ctx.from.id, item1.id, { fusedWith: item2.id });
    addHistory(ctx.from.id, { type: 'fuse', item: `${item1.name}+${item2.name}`, amount: -FUSE_COST });

    await ctx.reply(`🧪 *Fused!* ${displayName(item1)} now carries the essence of ${displayName(item2)}.`, { parse_mode: 'Markdown' });
  },
};
