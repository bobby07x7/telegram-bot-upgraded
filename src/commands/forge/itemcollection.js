const { getUser } = require('../../database/store');
const { ITEMS, getItem, displayName } = require('../../database/items');

module.exports = {
  name: 'itemcollection',
  description: 'Track every item you have ever bought — /itemcollection',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const total = Object.keys(ITEMS).length;
    const seen = user.collectionLog.length;
    const percent = total ? Math.round((seen / total) * 100) : 0;

    const lines = [`📖 *COLLECTION* — ${seen}/${total} (${percent}%)`, ''];
    if (!seen) {
      lines.push('Nothing collected yet — buy items with /buy to start your collection!');
    } else {
      for (const id of user.collectionLog) {
        const item = getItem(id);
        if (item) lines.push(displayName(item));
      }
    }
    lines.push('');
    lines.push('_Note: only items bought via /buy count toward collection right now — gifts and gacha wins aren\'t tracked yet._');

    await ctx.reply(lines.join('\n'), { parse_mode: 'Markdown' });
  },
};
