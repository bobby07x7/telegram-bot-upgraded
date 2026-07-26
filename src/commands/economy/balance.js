const { getUser } = require('../../database/store');
const { card } = require('../../core/uiHelper');

module.exports = {
  name: 'balance',
  description: 'Check your wallet & bank balance',
  category: 'economy',
  ownerOnly: false,
  execute: async (ctx, { config }) => {
    const user = getUser(ctx.from.id, config);
    const text = card({
      icon: '💰',
      title: 'Balance',
      lines: [`Wallet: \`${user.balance}\``, `Bank: \`${user.bank}\``, `Net worth: \`${user.balance + user.bank}\``],
    });
    await ctx.reply(text, { parse_mode: 'Markdown' });
  },
};
