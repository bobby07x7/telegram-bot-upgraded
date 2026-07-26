// In-memory session: one active number-guessing game per chat.
const sessions = new Map();

module.exports = {
  name: 'guess',
  description: 'Number guessing game (1-100) — /guess to start, /guess <number> to guess',
  execute: async (ctx) => {
    const chatId = ctx.chat.id;
    const arg = ctx.message.text.split(' ')[1];

    if (!arg) {
      sessions.set(chatId, { target: Math.floor(Math.random() * 100) + 1, tries: 0 });
      await ctx.reply("🔢 I'm thinking of a number between 1-100. Use /guess <number> to guess it!");
      return;
    }

    const session = sessions.get(chatId);
    if (!session) {
      await ctx.reply('❓ No active game. Use /guess to start one.');
      return;
    }

    const num = parseInt(arg, 10);
    if (isNaN(num)) {
      await ctx.reply('❌ Please guess a valid number.');
      return;
    }

    session.tries++;
    if (num === session.target) {
      sessions.delete(chatId);
      await ctx.reply(`🎉 Correct! The number was ${num}. You got it in ${session.tries} tries.`);
    } else if (num < session.target) {
      await ctx.reply('📈 Higher!');
    } else {
      await ctx.reply('📉 Lower!');
    }
  },
};
