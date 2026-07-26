const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

const GACHA_CODES = {
  FREESPIN: { type: 'item', item: 'Health Potion', emoji: '🟢' },
};

module.exports = {
  name: 'gacharedeem',
  description: 'Redeem a gacha-exclusive code for a free item — /gacharedeem <code>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const code = (ctx.message.text.split(' ')[1] || '').trim().toUpperCase();
    if (!code) return ctx.reply('Usage: /gacharedeem <code>');

    const user = getUser(id);
    user.redeemedGachaCodes = user.redeemedGachaCodes || [];
    if (user.redeemedGachaCodes.includes(code)) return ctx.reply('❌ Already redeemed.');

    const reward = GACHA_CODES[code];
    if (!reward) return ctx.reply('❌ Invalid or expired code.');

    saveUser(id, {
      inventory: [...user.inventory, `${reward.emoji} ${reward.item}`],
      redeemedGachaCodes: [...user.redeemedGachaCodes, code],
    });
    await ctx.reply(`✅ Redeemed ${code}: received ${reward.emoji} ${reward.item}!`);
  },
};
