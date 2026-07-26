const PREFIXES = ['Captain', 'Sir', 'Lady', 'Doctor', 'Master', 'Agent', 'Professor'];
const SUFFIXES = ['the Bold', 'the Wise', 'the Swift', 'of Legends', 'the Great', 'the Mysterious'];

module.exports = {
  name: 'nickname',
  description: 'Generate a fun random nickname',
  execute: async (ctx) => {
    const name = ctx.message.reply_to_message?.from?.first_name || ctx.from.first_name;
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
    await ctx.reply(`🏷️ ${name}'s new nickname: "${prefix} ${name} ${suffix}"`);
  },
};
