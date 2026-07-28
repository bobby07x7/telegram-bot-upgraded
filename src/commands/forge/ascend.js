const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned, EVOLUTION_PREFIXES } = require('../../core/forge');
const { config } = require('../../config/config');

const ASCEND_COST = 250000;
const MAX_ASCENSION = 4; // Legendary -> Mythic -> Divine -> Celestial -> Infinity (prestige display only)
const ASCENSION_TITLES = ['', 'Mythic', 'Divine', 'Celestial', 'Infinity'];

module.exports = {
  name: 'ascend',
  // Note: this is a prestige/collection flourish, not a true rarity change —
  // an item's real rarity is fixed by the catalog. Ascending grants a
  // displayed prestige title and a small badge, layered on top.
  description: 'Ascend a maxed-out Legendary+ item for a prestige title — /ascend <item> (cost 250,000🪙)',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /ascend <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const legendaryPlus = ['legendary', 'mythic', 'divine', 'celestial', 'infinity'];
    if (!legendaryPlus.includes(item.rarity)) return ctx.reply('⚠️ Only Legendary-tier (or higher) items can ascend.');

    const progress = getProgress(user, item.id);
    if (progress.stage < EVOLUTION_PREFIXES.length - 1) return ctx.reply(`⚠️ Fully /evolve this item first before ascending it.`);
    if (progress.ascension >= MAX_ASCENSION) return ctx.reply(`✅ ${displayName(item)} has reached max ascension (${ASCENSION_TITLES[MAX_ASCENSION]}).`);
    if (user.balance < ASCEND_COST) return ctx.reply(`❌ Ascending costs ${ASCEND_COST}${config.economy.currencySymbol}.`);

    saveUser(ctx.from.id, { balance: user.balance - ASCEND_COST });
    const updated = saveProgress(ctx.from.id, item.id, { ascension: progress.ascension + 1 });
    addHistory(ctx.from.id, { type: 'ascend', item: item.name, amount: -ASCEND_COST });

    await ctx.reply(`🌟 *Ascended!* ${displayName(item)} now bears the ${ASCENSION_TITLES[updated.ascension]} prestige title.`, { parse_mode: 'Markdown' });
  },
};
