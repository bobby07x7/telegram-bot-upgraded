const QUOTES = [
  '"The only way to do great work is to love what you do." — Steve Jobs',
  '"In the middle of difficulty lies opportunity." — Albert Einstein',
  '"Success is not final, failure is not fatal." — Winston Churchill',
  '"The best time to plant a tree was 20 years ago. The second best time is now."',
  '"Believe you can and you\'re halfway there." — Theodore Roosevelt',
];

module.exports = {
  name: 'quote',
  description: 'Get an inspiring random quote',
  execute: async (ctx) => {
    await ctx.reply(`💭 ${QUOTES[Math.floor(Math.random() * QUOTES.length)]}`);
  },
};
