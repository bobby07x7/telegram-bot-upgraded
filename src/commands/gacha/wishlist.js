const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'wishlist',
  description: 'Add or view items on your gacha wishlist — /wishlist <item name>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const item = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    user.wishlist = user.wishlist || [];

    if (!item) {
      if (!user.wishlist.length) return ctx.reply('⭐ Your wishlist is empty. Add items with /wishlist <item name>');
      return ctx.reply(`⭐ *Your Wishlist*\n\n${user.wishlist.map((i) => `• ${i}`).join('\n')}`, { parse_mode: 'Markdown' });
    }
    saveUser(id, { wishlist: [...user.wishlist, item] });
    await ctx.reply(`⭐ Added "${item}" to your wishlist.`);
  },
};
