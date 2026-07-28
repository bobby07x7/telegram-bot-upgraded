const { getUser } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress, saveProgress, requireOwned } = require('../../core/forge');

module.exports = {
  name: 'favorite',
  description: 'Toggle ⭐ favorite on an item so it stands out in /inventory — /favorite <item>',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /favorite <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    if (!requireOwned(user, item)) return ctx.reply("❌ You don't own that item.");

    const progress = getProgress(user, item.id);
    const updated = saveProgress(ctx.from.id, item.id, { favorite: !progress.favorite });

    await ctx.reply(updated.favorite ? `⭐ ${displayName(item)} added to favorites.` : `${displayName(item)} removed from favorites.`);
  },
};
