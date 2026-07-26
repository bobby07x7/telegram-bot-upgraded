const FORTUNES = [
  "A pleasant surprise is waiting for you this week.",
  "Your hard work will soon pay off.",
  "An old friend will reach out to you soon.",
  "A great opportunity is coming your way — be ready.",
  "Patience will reward you more than haste.",
];

module.exports = {
  name: 'fortune',
  description: 'Get your fortune for today',
  execute: async (ctx) => {
    await ctx.reply(`🔮 ${FORTUNES[Math.floor(Math.random() * FORTUNES.length)]}`);
  },
};
