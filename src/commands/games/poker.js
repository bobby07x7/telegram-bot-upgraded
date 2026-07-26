const { newDeck, formatHand } = require('../../core/cardEngine');

function rankHand(hand) {
  const ranks = hand.map((c) => c.rank);
  const counts = {};
  ranks.forEach((r) => (counts[r] = (counts[r] || 0) + 1));
  const values = Object.values(counts).sort((a, b) => b - a);
  const isFlush = hand.every((c) => c.suit === hand[0].suit);

  if (values[0] === 4) return { score: 7, label: 'Four of a Kind' };
  if (values[0] === 3 && values[1] === 2) return { score: 6, label: 'Full House' };
  if (isFlush) return { score: 5, label: 'Flush' };
  if (values[0] === 3) return { score: 3, label: 'Three of a Kind' };
  if (values[0] === 2 && values[1] === 2) return { score: 2, label: 'Two Pair' };
  if (values[0] === 2) return { score: 1, label: 'One Pair' };
  return { score: 0, label: 'High Card' };
}

module.exports = {
  name: 'poker',
  description: 'Play a quick 5-card poker round vs the bot — /poker <bet amount>',
  execute: async (ctx) => {
    const { getUser, saveUser, addHistory } = require('../../database/store');
    const { config } = require('../../config/config');
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);

    if (!amount || amount <= 0) {
      await ctx.reply('❓ Usage: /poker <bet amount>');
      return;
    }

    const user = getUser(ctx.from.id);
    if (amount > user.balance) {
      await ctx.reply('❌ Insufficient balance.');
      return;
    }

    const deck = newDeck();
    const playerHand = deck.splice(0, 5);
    const botHand = deck.splice(0, 5);
    const playerRank = rankHand(playerHand);
    const botRank = rankHand(botHand);

    const win = playerRank.score > botRank.score;
    const draw = playerRank.score === botRank.score;
    const delta = draw ? 0 : win ? amount : -amount;

    saveUser(ctx.from.id, { balance: user.balance + delta });
    addHistory(ctx.from.id, { type: 'poker round', amount: delta });

    await ctx.reply(
      `🃏 *Poker Round*\n\n` +
      `Your hand: ${formatHand(playerHand)} — ${playerRank.label}\n` +
      `Bot's hand: ${formatHand(botHand)} — ${botRank.label}\n\n` +
      (draw ? "🤝 It's a tie!" : win ? `🎉 You win ${amount}${config.economy.currencySymbol}!` : `😔 You lose ${amount}${config.economy.currencySymbol}.`),
      { parse_mode: 'Markdown' }
    );
  },
};
