const COOKIES = [
  "A journey of a thousand miles begins with a single step.",
  "Good things come to those who wait, but better things come to those who work.",
  "Your talents will be recognized and rewarded.",
  "A fresh start will put you on your way.",
  "The greatest risk is not taking one.",
];

module.exports = {
  name: 'fortunecookie',
  description: 'Crack open a fortune cookie',
  execute: async (ctx) => {
    await ctx.reply(`🥠 ${COOKIES[Math.floor(Math.random() * COOKIES.length)]}`);
  },
};
