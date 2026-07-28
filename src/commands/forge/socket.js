const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, getItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');
const { config } = require('../../config/config');

const SOCKET_COST = 3000;
const GEM_IDS = ['gemruby', 'gememerald', 'gemsapphire', 'gemobsidian', 'gemdiamond', 'gemcelestial'];

module.exports = {
  name: 'socket',
  description: 'Insert an owned gem into an item — /socket <item> <gem> (cost 3,000🪙 + consumes the gem)',
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ').slice(1);
    if (parts.length < 2) return ctx.reply('⚠️ Usage: /socket <item> <gem>\nExample: /socket sword gemruby');

    const gemId = parts[parts.length - 1].toLowerCase();
    const itemQuery = parts.slice(0, -1).join(' ');
    const item = findItem(itemQuery);
    const gem = GEM_IDS.includes(gemId) ? getItem(gemId) : null;

    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");
    if (!gem || !user.inventory.includes(gem.id)) return ctx.reply('❌ You need to own the gem you want to socket. Check /shop → 💎 Gems.');

    const progress = getProgress(user, item.id);
    if (!progress.forged) return ctx.reply(`⚠️ Forge it first — /forge ${item.id}`);
    if (user.balance < SOCKET_COST) return ctx.reply(`❌ Socketing costs ${SOCKET_COST}${config.economy.currencySymbol}.`);

    const inventory = [...user.inventory];
    inventory.splice(inventory.indexOf(gem.id), 1); // consume one gem
    saveUser(ctx.from.id, { balance: user.balance - SOCKET_COST, inventory });
    saveProgress(ctx.from.id, item.id, { socketedGem: gem.id });
    addHistory(ctx.from.id, { type: 'socket', item: item.name, amount: -SOCKET_COST });

    await ctx.reply(`💎 *Socketed!* ${displayName(gem)} has been inserted into ${displayName(item)}.`, { parse_mode: 'Markdown' });
  },
};
