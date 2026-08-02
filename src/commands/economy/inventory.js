const { getUser } = require('../../database/store');
const { getItem, RARITY, UPGRADE_MAX_LEVEL } = require('../../database/items');

module.exports = {
  name: 'inventory',
  description: 'View items you currently own, grouped by slot with equip status',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    if (!user.inventory.length) {
      return ctx.reply('🎒 Your inventory is empty. Visit /shop or /spin to get your first item!');
    }

    const equipped = user.equipped || {};
    const upgrades = user.upgrades || {};
    const counts = {};
    for (const stored of user.inventory) counts[stored] = (counts[stored] || 0) + 1;

    const lines = ['╔══════ 🎒 𝐈𝐍𝐕𝐄𝐍𝐓𝐎𝐑𝐘 ══════╗', '║'];

    for (const [stored, count] of Object.entries(counts)) {
      const item = getItem(stored);
      if (item) {
        const rarity = RARITY[item.rarity];
        const isEquipped = Object.values(equipped).includes(stored);
        const tag = isEquipped ? '  ✅ Equipped' : '';
        const lvl = upgrades[stored];
        const lvlTag = lvl ? `  🔨Lv.${lvl}${lvl >= UPGRADE_MAX_LEVEL ? '(MAX)' : ''}` : '';
        lines.push(`║ ${item.emoji} *${item.name}* ${rarity.emoji} x${count}${tag}${lvlTag}`);
      } else {
        // Legacy item stored as a plain display string (pre-upgrade data)
        lines.push(`║ • ${stored} x${count}`);
      }
    }

    lines.push('║');
    lines.push('║ 🧷 /equip <item> — equip a weapon/armor/accessory');
    lines.push('║ 🔨✨ /upgrade <item> — level it up (buffs /fight)');
    lines.push('║ 💱 /sell <item> — sell for coins');
    lines.push('║ 🎁 /gift <item> — send to another user');
    lines.push('╚═══════════════════════════╝');

    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  },
};
