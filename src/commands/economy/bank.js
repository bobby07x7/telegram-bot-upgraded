const { getUser } = require('../../database/store');
const { card, buildKeyboard } = require('../../core/uiHelper');

module.exports = {
  name: 'bank',
  description: 'Manage your bank account',
  category: 'economy',
  ownerOnly: false,
  execute: async (ctx, { config }) => {
    const user = getUser(ctx.from.id, config);
    const text = card({
      icon: '🏦',
      title: 'Bank',
      lines: [`Wallet: \`${user.balance}\``, `Bank: \`${user.bank}\` (safe from other players)`],
    });
    const keyboard = buildKeyboard([
      [{ text: '⬆️ Deposit All', callback_data: `bank:deposit:${ctx.from.id}` },
       { text: '⬇️ Withdraw All', callback_data: `bank:withdraw:${ctx.from.id}` }],
    ]);
    await ctx.reply(text, { parse_mode: 'Markdown', ...keyboard });
  },
};
