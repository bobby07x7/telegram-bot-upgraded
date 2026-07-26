const { card } = require('../../core/uiHelper');

const ANSWERS = [
  'Yes, definitely.', 'Without a doubt.', 'Ask again later.', 'Very doubtful.',
  'My sources say no.', 'Absolutely!', 'Cannot predict now.', 'Outlook not so good.',
];

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question',
  category: 'fun',
  ownerOnly: false,
  execute: async (ctx) => {
    const question = ctx.args?.join(' ');
    if (!question) return ctx.reply('Ask a question — e.g. `/8ball will I win today?`', { parse_mode: 'Markdown' });
    const msg = await ctx.reply('🎱 Shaking the ball...');
    await new Promise((r) => setTimeout(r, 900));
    const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
    const text = card({ icon: '🎱', title: 'The 8-Ball says...', lines: [`*${answer}*`] });
    await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, text, { parse_mode: 'Markdown' });
  },
};
