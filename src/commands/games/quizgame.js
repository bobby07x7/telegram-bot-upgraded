const QUESTIONS = [
  { q: 'What is the capital of Japan?', options: ['Tokyo', 'Seoul', 'Beijing', 'Bangkok'], answer: 0 },
  { q: 'How many continents are there?', options: ['5', '6', '7', '8'], answer: 2 },
  { q: 'What is the largest planet?', options: ['Earth', 'Jupiter', 'Mars', 'Saturn'], answer: 1 },
  { q: 'Who wrote Romeo and Juliet?', options: ['Dickens', 'Shakespeare', 'Tolstoy', 'Twain'], answer: 1 },
];

module.exports = {
  name: 'quizgame',
  description: 'Get a random trivia question',
  execute: async (ctx) => {
    const { Markup } = require('telegraf');
    const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const buttons = q.options.map((opt, i) => Markup.button.callback(opt, `quiz:${q.options[q.answer] === opt ? 'correct' : 'wrong'}`));

    await ctx.reply(`❓ ${q.q}`, Markup.inlineKeyboard(buttons, { columns: 2 }));
  },
};
