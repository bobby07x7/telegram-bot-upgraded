const { getUser, saveUser } = require('../database/store');
const { card } = require('../core/uiHelper');

module.exports = {
  pattern: /^bank:(deposit|withdraw):(\d+)$/,
  handle: async (ctx, { config }) => {
    const [, action, ownerId] = ctx.callbackQuery.data.match(/^bank:(deposit|withdraw):(\d+)$/);
    if (String(ctx.from.id) !== ownerId) {
      return ctx.answerCbQuery('This is not your bank menu.', { show_alert: true });
    }
    const user = getUser(ctx.from.id, config);
    let updated;
    if (action === 'deposit') {
      updated = saveUser(ctx.from.id, { balance: 0, bank: user.bank + user.balance });
    } else {
      updated = saveUser(ctx.from.id, { balance: user.balance + user.bank, bank: 0 });
    }
    const text = card({
      icon: '🏦',
      title: `Bank — ${action === 'deposit' ? 'Deposited' : 'Withdrew'}!`,
      lines: [`Wallet: \`${updated.balance}\``, `Bank: \`${updated.bank}\``],
    });
    await ctx.editMessageText(text, { parse_mode: 'Markdown' });
  },
};
