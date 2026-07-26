module.exports = {
  id: 'menu:close',
  handler: async (ctx) => {
    await ctx.answerCbQuery('Closed');
    try {
      await ctx.deleteMessage();
    } catch (_) {
      await ctx.editMessageText('Menu closed.');
    }
  },
};
