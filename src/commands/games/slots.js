const { getUser, saveUser } = require('../../database/store');
const { card } = require('../../core/uiHelper');

const SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
const BET = 50;

module.exports = {
  name: 'slots',
  description: `Play the slot machine (bet: ${BET} coins)`,
  category: 'games',
  ownerOnly: false,
  execute: async (ctx, { config }) => {
    const user = getUser(ctx.from.id, config);
    if (user.balance < BET) return ctx.reply(`❌ You need \`${BET}\` coins to play.`, { parse_mode: 'Markdown' });

    const msg = await ctx.reply('🎰 [ ❓ | ❓ | ❓ ]');
    const spins = 5;
    let reel = [];
    for (let i = 0; i < spins; i++) {
      reel = Array.from({ length: 3 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      await new Promise((r) => setTimeout(r, 250));
      try {
        await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, `🎰 [ ${reel.join(' | ')} ]`);
      } catch (_) {}
    }

    const win = reel[0] === reel[1] && reel[1] === reel[2];
    const payout = win ? BET * 5 : 0;
    saveUser(ctx.from.id, { balance: user.balance - BET + payout });

    const text = card({
      icon: win ? '🏆' : '🎰',
      title: win ? 'JACKPOT!' : 'No match',
      lines: [`[ ${reel.join(' | ')} ]`, win ? `+\`${payout}\` coins!` : `-\`${BET}\` coins`],
    });
    await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, text, { parse_mode: 'Markdown' });
  },
};
