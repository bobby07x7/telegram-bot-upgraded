const TRUTHS = [
  "What's the most embarrassing thing that's happened to you this year?",
  "What's a secret you've never told anyone in this group?",
  "What's the biggest lie you've ever told?",
  "Who was your first crush?",
  "What's your biggest fear?",
];

module.exports = {
  name: 'truth',
  description: 'Get a random truth question',
  execute: async (ctx) => {
    await ctx.reply(`🤔 Truth: ${TRUTHS[Math.floor(Math.random() * TRUTHS.length)]}`);
  },
};
