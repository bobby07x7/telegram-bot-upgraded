const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { validateBet, buildBetResultCard } = require('../../core/betting');
const { playCasinoSpin } = require('../../core/uiHelper');

const CHOICES = ['rock', 'paper', 'scissors'];
const EMOJI = { rock: '🪨', paper: '📄', scissors: '✂️' };
const reelFn = () => EMOJI[CHOICES[Math.floor(Math.random() * 3)]];

function decide(user, bot) {
  if (user === bot) return 'draw';
  if ((user === 'rock' && bot === 'scissors') || (user === 'paper' && bot === 'rock') || (user === 'scissors' && bot === 'paper')) return 'win';
  return 'lose';
}

module.exports = {
  name: 'rps',
  description: 'Play Rock-Paper-Scissors vs the bot — /rps rock|paper|scissors [bet amount]',
  execute: async (ctx) => {
    const parts = ctx.message.text.split(' ');
    const choice = (parts[1] || '').toLowerCase();
    const amount = parseInt(parts[2], 10);

    if (!CHOICES.includes(choice)) {
      await ctx.reply('❓ Usage: /rps rock | paper | scissors [bet amount]');
      return;
    }

    const botChoice = CHOICES[Math.floor(Math.random() * 3)];
    const result = decide(choice, botChoice);

    if (!amount) {
      const resultText = result === 'draw' ? "It's a draw!" : result === 'win' ? 'You win! 🎉' : 'You lose!';
      await ctx.reply(`${EMOJI[choice]} vs ${EMOJI[botChoice]}\n${resultText}\n\n💡 Tip: add a bet amount, e.g. /rps ${choice} 100`);
      return;
    }

    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}`);

    const win = result === 'win';
    const draw = result === 'draw';
    const delta = draw ? 0 : win ? amount : -amount;
    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'rps bet', amount: delta });

    const resultText = buildBetResultCard({
      title: '✊ ROCK PAPER SCISSORS',
      lines: [`You: ${EMOJI[choice]}  vs  Bot: ${EMOJI[botChoice]}`, `Bet: ${amount}${config.economy.currencySymbol}`],
      won: win,
      delta,
    });

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '✊ RPS', reelFn, 'Choosing...');
  },
};
