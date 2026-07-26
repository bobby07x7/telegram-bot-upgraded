const HORSES = ['🐎', '🐴', '🦄'];

module.exports = {
  name: 'race',
  description: 'Bet on a horse race — /race 1|2|3 <amount>',
  execute: async (ctx) => {
    const { getUser, saveUser, addHistory } = require('../../database/store');
    const { config } = require('../../config/config');
    const parts = ctx.message.text.split(' ');
    const pick = parseInt(parts[1], 10);
    const amount = parseInt(parts[2], 10);

    if (![1, 2, 3].includes(pick) || !amount || amount <= 0) {
      await ctx.reply('❓ Usage: /race 1|2|3 <amount>  (pick your horse: 1, 2, or 3)');
      return;
    }

    const user = getUser(ctx.from.id);
    if (amount > user.balance) {
      await ctx.reply('❌ Insufficient balance.');
      return;
    }

    const winner = Math.floor(Math.random() * 3) + 1;
    const win = winner === pick;
    const delta = win ? amount * 2 : -amount;

    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'horse race bet', amount: delta });

    await ctx.reply(
      `🏁 Race results!\n${HORSES.map((h, i) => `${i + 1}. ${h}${winner === i + 1 ? ' 🏆' : ''}`).join('\n')}\n\n` +
      (win ? `🎉 Horse ${winner} won! You earned ${amount * 2}${config.economy.currencySymbol}!` : `😔 Horse ${winner} won. You lost ${amount}${config.economy.currencySymbol}.`)
    );
  },
};
