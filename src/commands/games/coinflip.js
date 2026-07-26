const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const reelFn = () => (Math.random() < 0.5 ? '🪙 heads ↑' : '🪙 tails ↓');

module.exports = {
  name: 'coinflip',
  description: 'Flip a coin, optionally bet coins — /coinflip heads|tails [amount]',
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const call = (parts[1] || '').toLowerCase();
    const amount = parseInt(parts[2], 10);
    const result = Math.random() < 0.5 ? 'heads' : 'tails';

    if (!['heads', 'tails'].includes(call)) {
      return ctx.reply(`🪙 It landed on ${result}!\nTip: /coinflip heads 100 to bet.`);
    }

    if (!amount) {
      const win = call === result;
      return ctx.reply(`🪙 It landed on ${result}! ${win ? 'You guessed right! 🎉' : 'You guessed wrong.'}`);
    }

    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}`);

    const win = call === result;
    const delta = win ? amount : -amount;
    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'coinflip bet', amount: delta });

    const resultText = buildBetResultCard({
      title: '🪙 COINFLIP',
      lines: [`Landed on: ${result}`, `Your call: ${call} · ${amount}${config.economy.currencySymbol}`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🪙 COINFLIP', reelFn, 'Flipping...');
  },
};
