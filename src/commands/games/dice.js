const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const reelFn = () => DICE_FACES[Math.floor(Math.random() * 6)];

module.exports = {
  name: 'dice',
  description: 'Roll a dice (1-6), optionally bet coins — /dice [amount]',
  execute: async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);
    const roll = Math.floor(Math.random() * 6) + 1;

    if (!amount) return ctx.reply(`🎲 You rolled a ${roll}!`);

    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}`);

    const win = roll >= 4;
    const delta = win ? amount : -amount;
    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'dice bet', amount: delta });

    const resultText = buildBetResultCard({
      title: '🎲 DICE ROLL',
      lines: [`You rolled: ${roll} ${DICE_FACES[roll - 1]}`, `Bet: ${amount}${config.economy.currencySymbol} (win on 4-6)`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎲 DICE', reelFn, 'Rolling...');
  },
};
