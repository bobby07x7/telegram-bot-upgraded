const { getUser, saveUser } = require('../../database/store');
const { findItem, displayName } = require('../../database/items');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'gift',
  description: 'Gift an item from your inventory to someone — reply, @mention, or user id',
  execute: async (ctx) => {
    const senderId = ctx.from.id;
    const { target, rest: query } = resolveTarget(ctx);

    if (!target) return ctx.reply('↩️ Reply to, or @mention, the user you want to gift an item to.\nUsage: /gift <item name>');
    if (String(target.id) === String(senderId)) return ctx.reply('❌ You cannot gift an item to yourself.');

    const sender = getUser(senderId);
    const item = findItem(query);
    const idx = item
      ? sender.inventory.findIndex((i) => i === item.id)
      : sender.inventory.findIndex((i) => String(i).toLowerCase().includes(String(query).toLowerCase()));

    if (!query || idx === -1) return ctx.reply('Item not found in your /inventory.');

    const stored = sender.inventory[idx];
    const newInv = [...sender.inventory];
    newInv.splice(idx, 1);
    saveUser(senderId, { inventory: newInv });

    const receiver = getUser(target.id);
    saveUser(target.id, { inventory: [...receiver.inventory, stored] });

    const label = item ? displayName(item) : stored;
    await ctx.reply(`🎁 Gifted ${label} to ${target.first_name || target.username || target.id}!`);
  },
};
