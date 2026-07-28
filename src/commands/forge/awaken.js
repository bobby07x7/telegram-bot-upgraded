const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const AWAKEN_COST = 100000;
const STONE_ID = 'awakeningstone';

module.exports = {
  name: 'awaken',
  description: 'Unlock hidden power on a fully-refined item — /awaken <item> (cost 100,000🪙 + 1 Awakening Stone)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /awaken <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);
    if (progress.awakened) return ctx.reply(`✅ ${displayName(item)} is already awakened.`);
    if (!user.inventory.includes(STONE_ID)) return ctx.reply('❌ You need an 🪄 Awakening Stone. Buy one from /shop.');
    if (user.balance < AWAKEN_COST) return ctx.reply(`❌ Awakening costs ${AWAKEN_COST}${config.economy.currencySymbol}.`);

    const inventory = [...user.inventory];
    inventory.splice(inventory.indexOf(STONE_ID), 1);
    saveUser(ctx.from.id, { balance: user.balance - AWAKEN_COST, inventory });
    saveProgress(ctx.from.id, item.id, { awakened: true });
    addHistory(ctx.from.id, { type: 'awaken', item: item.name, amount: -AWAKEN_COST });

    await ctx.reply(`🪄 *Awakened!* ${displayName(item)} has unlocked a new passive, aura, and skill.`, { parse_mode: 'Markdown' });
  },
};
