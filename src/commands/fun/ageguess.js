module.exports = {
  name: 'ageguess',
  description: 'Randomly guess someone\'s age (just for fun)',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from?.first_name || ctx.from.first_name;
    const age = Math.floor(Math.random() * 50) + 13;
    await ctx.reply(`🎯 My guess: ${target} is ${age} years old! (purely random, don't take it seriously)`);
  },
};
