const CHALLENGES = [
  "Don't use your phone for the next 30 minutes.",
  "Drink a full glass of water right now.",
  "Do 10 push-ups before your next message.",
  "Compliment 3 people in this chat today.",
  "Go one hour without checking social media.",
];

module.exports = {
  name: 'challenge',
  description: 'Get a random self-improvement challenge',
  execute: async (ctx) => {
    await ctx.reply(`💪 Challenge: ${CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]}`);
  },
};
