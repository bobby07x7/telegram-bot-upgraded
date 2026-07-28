const { getUser, saveUser, addHistory } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { saveProgress, requireOwned, SKINS } = require('../../core/forge');
const { config } = require('../../config/config');

const SKIN_COST = 1000;

module.exports = {
  name: 'skin',
  description: `Apply a cosmetic skin to an item — /skin <item> <${SKINS.map((s) => s.split(' ')[0].toLowerCase()).join('|')}> (cost 1,000🪙)`,
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ').slice(1);
    if (parts.length < 2) return ctx.reply(`⚠️ Usage: /skin <item> <skin>\nAvailable skins: ${SKINS.join(', ')}`);

    const skinKey = parts[parts.length - 1].toLowerCase();
    const itemQuery = parts.slice(0, -1).join(' ');
    const skin = SKINS.find((s) => s.toLowerCase().startsWith(skinKey));
    const item = findItem(itemQuery);
    const user = getUser(ctx.from.id);

    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");
    if (!skin) return ctx.reply(`❌ Unknown skin. Available: ${SKINS.join(', ')}`);
    if (user.balance < SKIN_COST) return ctx.reply(`❌ Applying a skin costs ${SKIN_COST}${config.economy.currencySymbol}.`);

    saveUser(ctx.from.id, { balance: user.balance - SKIN_COST });
    saveProgress(ctx.from.id, item.id, { skin });
    addHistory(ctx.from.id, { type: 'skin', item: item.name, amount: -SKIN_COST });

    await ctx.reply(`🎨 *Skin applied!* ${displayName(item)} now shows the ${skin}.`, { parse_mode: 'Markdown' });
  },
};
