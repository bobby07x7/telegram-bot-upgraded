const { Markup } = require('telegraf');
const { newDeck, handTotal, formatHand } = require('../../core/cardEngine');
const sessions = require('../../core/blackjackSessions');
const { getUser, saveUser } = require('../../database/store');
const { validateBet } = require('../../core/betting');
const { config } = require('../../config/config');

function tableCard(playerHand, dealerUpcard, footer) {
  return (
    `╔═══════ 🃏 BLACKJACK ═══════╗\n` +
    `║\n` +
    `║  Dealer: ${dealerUpcard.rank}${dealerUpcard.suit}  ❓\n` +
    `║  You:    ${formatHand(playerHand)}  (${handTotal(playerHand)})\n` +
    `║\n` +
    `║  ${footer}\n` +
    `╚════════════════════════════╝`
  );
}

module.exports = {
  name: 'blackjack',
  description: 'Play Blackjack (21) vs the dealer — /blackjack <bet amount>',
  execute: async (ctx) => {
    const amount = parseInt(ctx.message.text.split(' ')[1], 10);
    const user = getUser(ctx.from.id);
    const error = validateBet(amount, user.balance);
    if (error) return ctx.reply(`❓ ${error}\nUsage: /blackjack <bet amount>`);

    saveUser(ctx.from.id, { balance: user.balance - amount });

    const deck = newDeck();
    const player = [deck.pop(), deck.pop()];
    const dealer = [deck.pop(), deck.pop()];
    sessions.set(ctx.chat.id, { deck, player, dealer, bet: amount, userId: ctx.from.id });

    await ctx.reply(
      tableCard(player, dealer[0], `Bet: ${amount}${config.economy.currencySymbol} · Hit or Stand?`),
      Markup.inlineKeyboard([[
        Markup.button.callback('🃏 Hit', `bj:hit:${ctx.chat.id}`),
        Markup.button.callback('✋ Stand', `bj:stand:${ctx.chat.id}`),
      ]])
    );
  },
};
