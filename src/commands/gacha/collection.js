const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'collection',
  description: 'View your unique gacha collection progress',
  execute: async (ctx) => {
    const { ITEM_POOL } = require('../../core/gachaEngine');
    const user = getUser(ctx.from.id);
    const allItems = Object.values(ITEM_POOL).flat();
    const owned = new Set(user.inventory.map((i) => i.replace(/^\S+\s/, '')));
    const ownedCount = allItems.filter((i) => owned.has(i)).length;

    await ctx.reply(`📖 Collection Progress: ${ownedCount}/${allItems.length} unique items collected.`);
  },
};
