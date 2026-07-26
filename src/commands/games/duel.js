const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { playEliminationCinematic } = require('../../core/uiHelper');
const { protectMessage, isProtectedTarget } = require('../../core/godProtect');

const CLASH_FRAMES = [
  'Weapons drawn... ⚔️',
  'Circling each other... 🌀',
  'Steel meets steel... ⚡',
  'Final strike incoming...',
];

module.exports = {
  name: 'duel',
  description: 'Challenge another user to a coin duel — /duel <amount> (reply to their message)',
  execute: async (ctx) => {
    const challengerId = ctx.from.id;
    const target = ctx.message.reply_to_message?.from;
    const amount = parseInt((ctx.message.text.split(' ')[1] || '').trim(), 10);

    if (!target) return ctx.reply('↩️ Reply to the user you want to duel.\nUsage: /duel <amount>');
    if (target.id === challengerId) return ctx.reply('❌ You cannot duel yourself.');
    if (target.is_bot) return ctx.reply('🤖 You cannot duel a bot.');
    if (isProtectedTarget(target.id)) {
      return ctx.reply(protectMessage(target.first_name), { parse_mode: 'Markdown' });
    }
    if (!amount || amount <= 0) return ctx.reply('Usage: /duel <amount> (as a reply to your opponent)');

    const challenger = getUser(challengerId);
    const opponent = getUser(target.id);

    if (amount > challenger.balance) return ctx.reply("❌ You don't have enough coins to stake that much.");
    if (amount > opponent.balance) return ctx.reply(`❌ ${target.first_name} doesn't have enough coins to match that stake.`);

    // Outcome is fully decided up front — the animation only reveals it.
    const challengerWins = Math.random() < 0.5;
    const winnerId = challengerWins ? challengerId : target.id;
    const loserId = challengerWins ? target.id : challengerId;
    const winnerName = challengerWins ? ctx.from.first_name : target.first_name;
    const loserName = challengerWins ? target.first_name : ctx.from.first_name;

    saveUser(challengerId, { balance: challenger.balance + (challengerWins ? amount : -amount) });
    saveUser(target.id, { balance: opponent.balance + (challengerWins ? -amount : amount) });
    addHistory(winnerId, { type: 'duel win', amount });
    addHistory(loserId, { type: 'duel loss', amount: -amount });

    const resultText =
      `⚔️ *DUEL RESULT*\n\n` +
      `🏆 ${winnerName} strikes true and wins the duel!\n` +
      `💰 Takes ${amount}${config.economy.currencySymbol} from ${loserName}.`;

    await playEliminationCinematic(ctx, {
      introLabel: `⚔️ ${ctx.from.first_name} vs ${target.first_name} (${amount}${config.economy.currencySymbol})`,
      suspenseFrames: CLASH_FRAMES,
      resultText,
      extra: { parse_mode: 'Markdown' },
    });
  },
};
