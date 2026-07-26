const { handTotal, formatHand } = require('../core/cardEngine');
const sessions = require('../core/blackjackSessions');
const { saveUser, getUser, addHistory } = require('../database/store');
const { config } = require('../config/config');

function resultCard(playerHand, dealerHand, outcomeLine, revealDealer = false) {
  const dealerLine = revealDealer
    ? `Dealer: ${formatHand(dealerHand)}  (${handTotal(dealerHand)})`
    : `Dealer: ${dealerHand[0].rank}${dealerHand[0].suit}  ❓`;

  return (
    `╔═══════ 🃏 BLACKJACK ═══════╗\n` +
    `║\n` +
    `║  ${dealerLine}\n` +
    `║  You:    ${formatHand(playerHand)}  (${handTotal(playerHand)})\n` +
    `║\n` +
    `║  ${outcomeLine}\n` +
    `╚════════════════════════════╝`
  );
}

module.exports = {
  id: /^bj:(hit|stand):(-?\d+)$/,
  handler: async (ctx) => {
    const action = ctx.match[1];
    const chatId = ctx.match[2];
    const session = sessions.get(chatId);

    if (!session) {
      await ctx.answerCbQuery('No active game.');
      return;
    }

    await ctx.answerCbQuery();
    const { currencySymbol } = config.economy;

    if (action === 'hit') {
      session.player.push(session.deck.pop());
      const total = handTotal(session.player);

      if (total > 21) {
        sessions.delete(chatId);
        addHistory(session.userId, { type: 'blackjack loss', amount: -session.bet });
        await ctx.editMessageText(
          resultCard(session.player, session.dealer, `💥 *BUST!* You lost ${session.bet}${currencySymbol}.`, true),
          { parse_mode: 'Markdown' }
        );
        return;
      }

      await ctx.editMessageText(
        resultCard(session.player, session.dealer, `Bet: ${session.bet}${currencySymbol} · Hit or Stand?`),
        { reply_markup: ctx.callbackQuery.message.reply_markup }
      );
      return;
    }

    // Stand — dealer plays
    while (handTotal(session.dealer) < 17) {
      session.dealer.push(session.deck.pop());
    }

    const playerTotal = handTotal(session.player);
    const dealerTotal = handTotal(session.dealer);
    const win = dealerTotal > 21 || playerTotal > dealerTotal;
    const draw = playerTotal === dealerTotal;
    const payout = draw ? session.bet : win ? session.bet * 2 : 0;

    const user = getUser(session.userId);
    saveUser(session.userId, { balance: user.balance + payout });
    addHistory(session.userId, { type: 'blackjack result', amount: payout - session.bet });
    sessions.delete(chatId);

    const outcome = draw
      ? '🤝 *PUSH* — bet returned.'
      : win
        ? `🎉 *YOU WIN* +${session.bet}${currencySymbol}`
        : `😔 *YOU LOST* -${session.bet}${currencySymbol}`;

    await ctx.editMessageText(resultCard(session.player, session.dealer, outcome, true), { parse_mode: 'Markdown' });
  },
};
