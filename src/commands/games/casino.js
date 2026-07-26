const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const SYMBOLS = ['🍒', '🍋', '🍇', '💎', '7️⃣'];
const reelFn = () => [0, 0, 0].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]).join(' | ');

module.exports = {
  name: 'casino',
  description: 'Play the casino slot machine — /casino <bet amount>',
  execute: async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);
    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}\nUsage: /casino <bet amount>`);

    const reels = [0, 0, 0].map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
    const allMatch = reels[0] === reels[1] && reels[1] === reels[2];
    const twoMatch = reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2];

    let multiplier = 0;
    if (allMatch) multiplier = 5;
    else if (twoMatch) multiplier = 1.5;

    const delta = Math.round(amount * multiplier) - amount;
    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'casino spin', amount: delta });

    const resultText = buildBetResultCard({
      title: '🎰 CASINO SLOTS',
      lines: [`[ ${reels.join(' | ')} ]`, `Bet: ${amount}${config.economy.currencySymbol}`],
      won: delta > 0,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎰 CASINO', reelFn);
  },
};
