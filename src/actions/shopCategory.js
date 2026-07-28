const { Markup } = require('telegraf');
const { config } = require('../config/config');
const { SHOP_ITEMS, RARITY } = require('../database/items');

const SLOT_LABELS = {
  weapon: '⚔️ WEAPONS',
  armor: '🛡️ ARMOR',
  accessory: '💍 ACCESSORIES',
  consumable: '🧪 POTIONS',
  gem: '💎 GEMS',
  wing: '🪽 WINGS',
  pet: '🐉 PETS',
  summon: '👹 SUMMONS',
  mount: '🐎 MOUNTS',
  cosmetic: '✨ COSMETICS',
};

module.exports = {
  // Matches callback_data like "shop:weapon", "shop:armor", "shop:cosmetic"
  id: /^shop:(.+)$/,
  handler: async (ctx) => {
    const slotKey = ctx.match[1];
    await ctx.answerCbQuery();

    const items = SHOP_ITEMS.filter((i) => (i.slot || 'cosmetic') === slotKey);
    const { currencySymbol } = config.economy;

    const lines = [`${SLOT_LABELS[slotKey] || slotKey.toUpperCase()}\nTap a Buy button below, or use /buy <id>.\n`];
    const buyRows = [];

    if (!items.length) {
      lines.push('Nothing here yet.');
    } else {
      for (const item of items) {
        const rarity = RARITY[item.rarity];
        lines.push(`${item.emoji} *${item.name}* ${rarity.emoji} — ${item.price}${currencySymbol}`);
        buyRows.push([Markup.button.callback(`🛒 Buy ${item.name} (${item.price}${currencySymbol})`, `buy:${item.id}`)]);
      }
    }

    const keyboard = Markup.inlineKeyboard([
      ...buyRows,
      [Markup.button.callback('🔙 Back to Store', 'menu:store_refresh')],
      [Markup.button.callback('🎒 Inventory', 'menu:inventory'), Markup.button.callback('✖️ Close', 'menu:close')],
    ]);

    await ctx.editMessageText(lines.join('\n'), { parse_mode: 'Markdown', ...keyboard });
  },
};
