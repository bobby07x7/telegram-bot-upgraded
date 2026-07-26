// In-memory session: one hangman game per chat.
const WORDS = ['javascript', 'telegram', 'developer', 'computer', 'keyboard', 'internet'];
const sessions = new Map();
const MAX_LIVES = 6;

function renderWord(word, guessed) {
  return word.split('').map((c) => (guessed.has(c) ? c : '_')).join(' ');
}

module.exports = {
  name: 'hangman',
  description: 'Play hangman — /hangman to start, /hangman <letter> to guess',
  execute: async (ctx) => {
    const chatId = ctx.chat.id;
    const arg = (ctx.message.text.split(' ')[1] || '').toLowerCase();

    if (!arg) {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      sessions.set(chatId, { word, guessed: new Set(), lives: MAX_LIVES });
      await ctx.reply(`🎮 Hangman started!\n${renderWord(word, new Set())}\n❤️ Lives: ${MAX_LIVES}\nGuess a letter: /hangman <letter>`);
      return;
    }

    const session = sessions.get(chatId);
    if (!session) {
      await ctx.reply('❓ No active game. Use /hangman to start.');
      return;
    }

    if (!/^[a-z]$/.test(arg)) {
      await ctx.reply('❌ Guess a single letter.');
      return;
    }

    session.guessed.add(arg);
    if (!session.word.includes(arg)) session.lives--;

    if (session.lives <= 0) {
      sessions.delete(chatId);
      await ctx.reply(`💀 Game over! The word was "${session.word}".`);
      return;
    }

    if ([...session.word].every((c) => session.guessed.has(c))) {
      sessions.delete(chatId);
      await ctx.reply(`🎉 You won! The word was "${session.word}".`);
      return;
    }

    await ctx.reply(`${renderWord(session.word, session.guessed)}\n❤️ Lives: ${session.lives}`);
  },
};
