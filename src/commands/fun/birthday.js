module.exports = {
  name: 'birthday',
  description: 'Randomly predict a birthday month (just for fun)',
  execute: async (ctx) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const month = months[Math.floor(Math.random() * 12)];
    const day = Math.floor(Math.random() * 28) + 1;
    await ctx.reply(`🎂 Our guess: your birthday is ${month} ${day}! (just a fun guess)`);
  },
};
