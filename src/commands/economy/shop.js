const { config } = require('../../config/config');
const { SHOP_ITEMS, RARITY } = require('../../database/items');

function slotLabel(slot) {
  const map = { weapon: '⚔️ Weapon', armor: '🛡️ Armor', accessory: '💍 Accessory', consumable: '🧪 Consumable' };
  return map[slot] || '✨ Cosmetic';
}

module.exports = {
  name: 'shop',
  description: 'Browse the store — professional casino-style catalog',
  execute: async (ctx) => {
    const { currencySymbol } = config.economy;
    const lines = [
      '╔══════ 🏪 𝐍𝐈𝐒𝐇𝐀 𝐒𝐓𝐎𝐑𝐄 ══════╗',
      '║',
    ];

    // Group items by slot for a cleaner, professional catalog layout.
    const bySlot = {};
    for (const item of SHOP_ITEMS) {
      bySlot[item.slot] = bySlot[item.slot] || [];
      bySlot[item.slot].push(item);
    }

    for (const [slot, items] of Object.entries(bySlot)) {
      lines.push(`║ ${slotLabel(slot)}`);
      for (const item of items) {
        const rarity = RARITY[item.rarity];
        lines.push(`║   ${item.emoji} *${item.name}* ${rarity.emoji} ${rarity.label}`);
        lines.push(`║   ↳ ${item.price}${currencySymbol}  •  buy: \`/buy ${item.id}\``);
      }
      lines.push('║');
    }

    lines.push('║ 🎒 View what you own: /inventory');
    lines.push('║ 🧷 Equip a slot item: /equip <item>');
    lines.push('╚═══════════════════════════╝');

    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  },
};
