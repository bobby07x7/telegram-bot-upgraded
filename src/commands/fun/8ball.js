const ANSWERS = [
  'Yes, definitely.', 'No way.', 'Ask again later.', 'It is certain.',
  'Very doubtful.', 'Signs point to yes.', 'Cannot predict now.', 'Absolutely!',
];

module.exports = {
  name: '8ball',
  description: 'Ask the magic 8-ball a question — /8ball <question>',
  execute: async (ctx) => {
    const question = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!question) {
      await ctx.reply('❓ Usage: /8ball Will I win the lottery?');
      return;
    }
    await ctx.reply(`🎱 ${ANSWERS[Math.floor(Math.random() * ANSWERS.length)]}`);
  },
};
