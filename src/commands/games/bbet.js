const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const WIN_CHANCE = 0.25; // lower odds than /bet
const PAYOUT_MULTIPLIER = 3; // but a bigger payout — win nets 2x your bet in profit
const reelFn = () => (Math.random() < 0.5 ? '💥' : '🔥');

module.exports = {
  name: 'bbet',
  description: 'Big Bet — high-risk 25% chance gamble for a 3x payout — /bbet <amount>',
  execute: async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);
    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}\nUsage: /bbet <amount>`);

    const win = Math.random() < WIN_CHANCE;
    const delta = win ? amount * (PAYOUT_MULTIPLIER - 1) : -amount;
    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'bbet', amount: delta });

    const resultText = buildBetResultCard({
      title: '💥 BIG BET',
      lines: [`Wagered: ${amount}${config.economy.currencySymbol}`, `Win chance: ${Math.round(WIN_CHANCE * 100)}% for ${PAYOUT_MULTIPLIER}x payout`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '💥 BIG BET', reelFn, 'Going big...');
  },
};
