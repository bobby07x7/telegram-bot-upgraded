const { getUser, saveUser } = require('../../database/store');
const { getItem, displayName } = require('../../database/items');

const VALID_SLOTS = ['weapon', 'armor', 'accessory'];

module.exports = {
  name: 'unequip',
  description: 'Unequip an item from a slot — /unequip <weapon|armor|accessory>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const slot = (ctx.message.text.split(' ')[1] || '').trim().toLowerCase();

    if (!VALID_SLOTS.includes(slot)) {
      return ctx.reply(`Usage: /unequip <${VALID_SLOTS.join('|')}>`);
    }

    const user = getUser(id);
    const equipped = { ...(user.equipped || {}) };
    const current = equipped[slot];
    if (!current) return ctx.reply(`You don't have anything equipped in your *${slot}* slot.`, { parse_mode: 'Markdown' });

    equipped[slot] = null;
    saveUser(id, { equipped });

    const item = getItem(current);
    await ctx.reply(`🧷 Unequipped ${item ? displayName(item) : current} from your *${slot}* slot.`, { parse_mode: 'Markdown' });
  },
};
