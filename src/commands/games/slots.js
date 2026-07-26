// Alias-style variant of /casino with different odds/reel size for variety.
const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const SYMBOLS = ['🔔', '🍀', '⭐', '💰'];
const reelFn = () => [0, 0, 0].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]).join(' | ');

module.exports = {
  name: 'slots',
  description: 'Play a 3-reel slot machine — /slots <bet amount>',
  execute: async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);
    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}\nUsage: /slots <bet amount>`);

    const reels = [0, 0, 0].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    const win = reels[0] === reels[1] && reels[1] === reels[2];
    const delta = win ? amount * 3 : -amount;

    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'slots spin', amount: delta });

    const resultText = buildBetResultCard({
      title: '🎰 SLOT MACHINE',
      lines: [`[ ${reels.join(' | ')} ]`, `Bet: ${amount}${config.economy.currencySymbol}`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎰 SLOTS', reelFn);
  },
};
