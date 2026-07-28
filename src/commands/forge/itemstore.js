const { getUser, saveUser } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { getProgress } = require('../../core/forge');

module.exports = {
  name: 'itemstore',
  description: 'Move an item from your active inventory into long-term storage — /itemstore <item>',
  execute: async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!query) return ctx.reply('⚠️ Usage: /itemstore <item>');

    const item = findItem(query);
    const user = getUser(ctx.from.id);
    const idx = item ? user.inventory.findIndex((i) => i === item.id) : -1;
    if (idx === -1) return ctx.reply("❌ You don't own that item in your active inventory.");

    if (getProgress(user, item.id).locked) return ctx.reply(`🔒 ${displayName(item)} is locked. Use /itemlock ${item.id} to unlock it first.`);

    const inventory = [...user.inventory];
    inventory.splice(idx, 1);
    saveUser(ctx.from.id, { inventory, storage: [...user.storage, item.id] });

    await ctx.reply(`📦 ${displayName(item)} moved to storage. Bring it back with /itemtake ${item.id}.`);
  },
};
