module.exports = {
  name: 'time',
  description: 'Get the current server time — /time [UTC offset]',
  execute: async (ctx) => {
    const arg = ctx.message.text.split(' ')[1];
    const offset = arg ? parseInt(arg, 10) : 0;
    const now = new Date(Date.now() + offset * 3600000);
    await ctx.reply(`🕐 Time (UTC${offset >= 0 ? '+' : ''}${offset}): ${now.toUTCString()}`);
  },
};
