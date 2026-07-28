const { Markup } = require('telegraf');
const { config } = require('../../config/config');
const { SHOP_ITEMS } = require('../../database/items');
const { getUser } = require('../../database/store');

const SLOT_META = {
  weapon: { label: '⚔️ Weapons', emoji: '⚔️' },
  armor: { label: '🛡️ Armor', emoji: '🛡️' },
  accessory: { label: '💍 Accessories', emoji: '💍' },
  consumable: { label: '🧪 Potions', emoji: '🧪' },
  gem: { label: '💎 Gems', emoji: '💎' },
  wing: { label: '🪽 Wings', emoji: '🪽' },
  pet: { label: '🐉 Pets', emoji: '🐉' },
  summon: { label: '👹 Summons', emoji: '👹' },
  mount: { label: '🐎 Mounts', emoji: '🐎' },
};
const COSMETIC_META = { label: '✨ Cosmetics', emoji: '✨' };

function buildShopOverview(user) {
  const { currencySymbol } = config.economy;
  const counts = {};
  for (const item of SHOP_ITEMS) {
    const key = item.slot || 'cosmetic';
    counts[key] = (counts[key] || 0) + 1;
  }

  const text =
    `🏪 *NISHA STORE*\n` +
    `Pick a category to browse.\n\n` +
    `👛 Balance: ${user.balance}${currencySymbol}\n` +
    `🏦 Bank: ${user.bank}${currencySymbol}`;

  const catButtons = Object.entries(SLOT_META)
    .filter(([slot]) => counts[slot])
    .map(([slot, meta]) => Markup.button.callback(`${meta.label} (${counts[slot]})`, `shop:${slot}`));
  if (counts.cosmetic) {
    catButtons.push(Markup.button.callback(`${COSMETIC_META.label} (${counts.cosmetic})`, 'shop:cosmetic'));
  }

  const rows = [];
  for (let i = 0; i < catButtons.length; i += 2) rows.push(catButtons.slice(i, i + 2));
  rows.push([Markup.button.callback('🎒 Inventory', 'menu:inventory'), Markup.button.callback('✖️ Close', 'menu:close')]);

  return { text, keyboard: Markup.inlineKeyboard(rows) };
}

module.exports = {
  name: 'shop',
  description: 'Browse the store — tap a category to see items',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const { text, keyboard } = buildShopOverview(user);
    await ctx.reply(text, { parse_mode: 'Markdown', ...keyboard });
  },
  buildShopOverview,
  SLOT_META,
  COSMETIC_META,
};
