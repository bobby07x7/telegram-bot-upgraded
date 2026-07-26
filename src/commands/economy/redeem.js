const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

const VALID_CODES = {
  WELCOME100: 100,
  BONUS500: 500,
};

module.exports = {
  name: 'redeem',
  description: 'Redeem a coupon code — /redeem <code>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const code = (ctx.message.text.split(' ')[1] || '').trim().toUpperCase();
    if (!code) return ctx.reply('Usage: /redeem <code>');

    const user = getUser(id);
    user.redeemedCodes = user.redeemedCodes || [];
    if (user.redeemedCodes.includes(code)) return ctx.reply('❌ You already redeemed this code.');

    const amount = VALID_CODES[code];
    if (!amount) return ctx.reply('❌ Invalid or expired code.');

    saveUser(id, { balance: user.balance + amount, redeemedCodes: [...user.redeemedCodes, code] });
    addHistory(id, { type: 'coupon redeemed', code, amount });
    await ctx.reply(`✅ Redeemed ${code}: +${amount}${config.economy.currencySymbol}`);
  },
};
