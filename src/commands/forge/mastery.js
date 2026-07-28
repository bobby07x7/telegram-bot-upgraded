const { getUser } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, requireOwned } = require('../../core/forge');

module.exports = {
  name: 'mastery',
  description: "View a weapon's mastery level — gained automatically by winning /fight with it equipped",
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /mastery <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    const xpForNext = progress.masteryLevel * 100;
    await ctx.reply(
      `🏆 *Mastery: ${displayName(item)}*\n\n` +
        `Level: ${progress.masteryLevel}/100\n` +
        `XP: ${progress.masteryXp}/${xpForNext}\n\n` +
        `_Equip this as your weapon and win fights to gain mastery Xp._`,
      { parse_mode: 'Markdown' }
    );
  },
};
