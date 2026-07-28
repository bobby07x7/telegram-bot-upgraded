const { getUser, saveUser } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');

module.exports = {
  name: 'itemtake',
  description: 'Move an item from storage back into your active inventory — /itemtake <item>',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /itemtake <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    const idx = item ? user.storage.findIndex((i) => i === item.id) : -1;
    if (idx === -1) return ctx.reply("❌ That item isn't in your storage.");

    const storage = [...user.storage];
    storage.splice(idx, 1);
    saveUser(ctx.from.id, { storage, inventory: [...user.inventory, item.id] });

    await ctx.reply(`📤 ${displayName(item)} moved back to your active /inventory.`);
  },
};
