const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const WIN_CHANCE = 0.45; // slight house edge
const reelFn = () => (Math.random() < 0.5 ? '🎲' : '🎰');

module.exports = {
  name: 'bet',
  description: 'Bet coins on a straight 45% double-or-nothing gamble — /bet <amount>',
  execute: async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);
    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}\nUsage: /bet <amount>`);

    const win = Math.random() < WIN_CHANCE;
    const delta = win ? amount : -amount;
    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'bet', amount: delta });

    const resultText = buildBetResultCard({
      title: '🎯 BET',
      lines: [`Wagered: ${amount}${config.economy.currencySymbol}`, `Win chance: ${Math.round(WIN_CHANCE * 100)}%`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎯 BET', reelFn, 'Rolling the odds...');
  },
};
