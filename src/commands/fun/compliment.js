const COMPLIMENTS = [
  "You light up every room you walk into.",
  "Your kindness doesn't go unnoticed — it inspires people.",
  "You have the best laugh.",
  "You're more talented than you realize.",
  "The world is better with you in it.",
];

module.exports = {
  name: 'compliment',
  description: 'Send a nice compliment',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from?.first_name || ctx.from.first_name;
    await ctx.reply(`💖 ${target}, ${COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]}`);
  },
};
