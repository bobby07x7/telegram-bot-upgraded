const { getUser, saveUser, addHistory } = require('../../database/store');
const { getItem, findItem, displayName } = require('../../database/items');

module.exports = {
  name: 'grant',
  description: 'Owner-only: give any item (including exclusive God-tier gear) to a user for free — reply to them with /grant <item_id>',
  ownerOnly: true,
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;
    const query = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();

    if (!target) return ctx.reply('↩️ Reply to the user you want to grant an item to.\nUsage: /grant <item_id> (as a reply)');
    if (!query) return ctx.reply('⚠️ Usage: /grant <item_id> (as a reply)\nExample: /grant godcrown');

    const item = getItem(query.toLowerCase()) || findItem(query);
    if (!item) return ctx.reply('❌ Unknown item. Check the id in the item catalog.');

    const user = getUser(target.id);
    saveUser(target.id, { inventory: [...user.inventory, item.id] });
    addHistory(target.id, { type: 'owner grant', item: item.name, amount: 0 });

    await ctx.reply(
      `👑 *GRANTED!*\n\n${displayName(item)} has been gifted to ${target.first_name} by the bot owner.\n_A gift from the GOD of this bot. 🔥_`,
      { parse_mode: 'Markdown' }
    );
  },
};
