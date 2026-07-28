const { getUser } = require('../../database/store');
const { findItem, displayName, RARITY } = require('../../database/items');
const { getProgress, progressDisplayName, ENCHANTS } = require('../../core/forge');

module.exports = {
  name: 'inspect',
  description: 'View full stats, upgrade progress, and value of an item — /inspect <item>',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /inspect <item>');

    const item = findItem(query);
    if (!item) return ctx.reply('❌ Unknown item.');

    const user = getUser(ctx.from.id);
    const owned = user.inventory.includes(item.id);
    const progress = getProgress(user, item.id);
    const rarity = RARITY[item.rarity];
    const enchant = progress.enchant ? ENCHANTS.find((e) => e.id === progress.enchant) : null;

    const lines = [
      `📊 *INSPECT: ${progressDisplayName(item, progress)}*`,
      '',
      `${rarity.emoji} Rarity: ${rarity.label}`,
      `💰 Value: ${item.price || '—'}${item.price ? '🪙' : ''}`,
      `📦 Owned: ${owned ? '✅ Yes' : '❌ No'}`,
    ];

    if (owned && progress.forged) {
      lines.push('');
      lines.push(`⬆️ Level: +${progress.level}`);
      lines.push(`🛠️ Durability: ${progress.durability}/100`);
      lines.push(`💠 Refine: ${progress.refine}`);
      lines.push(`✨ Enchant: ${enchant ? enchant.label : 'None'}`);
      lines.push(`💎 Socketed Gem: ${progress.socketedGem || 'None'}`);
      lines.push(`🔒 Locked: ${progress.locked ? 'Yes' : 'No'}`);
      lines.push(`🏆 Mastery: Lv.${progress.masteryLevel} (${progress.masteryXp} XP)`);
      if (progress.ascension) lines.push(`🌟 Ascension: Tier ${progress.ascension}`);
    } else if (owned) {
      lines.push('');
      lines.push('⚠️ Not forged yet — use /forge to unlock upgrade progress.');
    }

    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  },
};
