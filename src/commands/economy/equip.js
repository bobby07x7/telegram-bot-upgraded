const { getUser, saveUser } = require('../../database/store');
const { getItem, findItem, displayName } = require('../../database/items');

module.exports = {
  name: 'equip',
  description: 'Equip a weapon/armor/accessory/pet/mount/wing/gem/summon from your inventory — /equip <item>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const query = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    if (!query) return ctx.reply('Usage: /equip <item name or id>\nCheck /inventory for what you own.');

    const user = getUser(id);
    const item = findItem(query);
    const owned = item
      ? user.inventory.includes(item.id)
      : user.inventory.some((i) => String(i).toLowerCase().includes(query.toLowerCase()));

    if (!item || !owned) return ctx.reply('❌ You don\'t own that item, or it can\'t be identified. Check /inventory.');
    if (!item.slot || item.slot === 'consumable') {
      return ctx.reply(`❌ ${displayName(item)} can't be equipped — it's a ${item.slot || 'cosmetic'} item.`);
    }

    const equipped = { ...(user.equipped || { weapon: null, armor: null, accessory: null }), [item.slot]: item.id };
    saveUser(id, { equipped });

    await ctx.reply(`🧷 Equipped ${displayName(item)} in your *${item.slot}* slot.`, { parse_mode: 'Markdown' });
  },
};
