// Simplified Wordle: 5-letter word, 6 attempts, in-memory per chat.
const WORDS = ['apple', 'chair', 'plane', 'brave', 'store', 'light'];
const sessions = new Map();

function evaluate(guess, target) {
  return guess.split('').map((c, i) => {
    if (target[i] === c) return '🟩';
    if (target.includes(c)) return '🟨';
    return '⬜';
  }).join('');
}

module.exports = {
  name: 'wordle',
  description: 'Play Wordle — /wordle to start, /wordle <5-letter word> to guess',
  execute: async (ctx) => {
    const chatId = ctx.chat.id;
    const arg = (ctx.message.text.split(' ')[1] || '').toLowerCase();

    if (!arg) {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      sessions.set(chatId, { word, attempts: 0 });
      await ctx.reply('🟩 Wordle started! Guess the 5-letter word with /wordle <word> (6 attempts).');
      return;
    }

    const session = sessions.get(chatId);
    if (!session) {
      await ctx.reply('❓ No active game. Use /wordle to start.');
      return;
    }
    if (arg.length !== 5) {
      await ctx.reply('❌ Your guess must be exactly 5 letters.');
      return;
    }

    session.attempts++;
    const feedback = evaluate(arg, session.word);

    if (arg === session.word) {
      sessions.delete(chatId);
      await ctx.reply(`${feedback}\n🎉 Correct! Solved in ${session.attempts} attempts.`);
      return;
    }

    if (session.attempts >= 6) {
      sessions.delete(chatId);
      await ctx.reply(`${feedback}\n💀 Out of attempts! The word was "${session.word}".`);
      return;
    }

    await ctx.reply(`${feedback}\nAttempt ${session.attempts}/6 — try again!`);
  },
};
