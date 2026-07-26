const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const COLORS = ['red', 'black'];
const reelFn = () => `🔴${Math.floor(Math.random() * 37)}⚫`;

module.exports = {
  name: 'roulette',
  description: 'Play roulette — /roulette red|black <amount>',
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const color = (parts[1] || '').toLowerCase();
    const amount = parseInt(parts[2], 10);

    if (!COLORS.includes(color)) return ctx.reply('❓ Usage: /roulette red|black <amount>');

    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}\nUsage: /roulette red|black <amount>`);

    const number = Math.floor(Math.random() * 37); // 0-36, 0 = green (house wins)
    const result = number === 0 ? 'green' : number % 2 === 0 ? 'black' : 'red';
    const win = result === color;
    const delta = win ? amount : -amount;

    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'roulette bet', amount: delta });

    const resultText = buildBetResultCard({
      title: '🎡 ROULETTE',
      lines: [`Ball landed on ${number} (${result})`, `Your bet: ${color} · ${amount}${config.economy.currencySymbol}`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎡 ROULETTE', reelFn, 'Ball is spinning...');
  },
};
