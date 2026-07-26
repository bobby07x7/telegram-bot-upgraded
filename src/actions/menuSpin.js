module.exports = {
  id: 'menu:spin',
  handler: async (ctx, { commands }) => {
    await ctx.answerCbQuery();
    const spinCmd = commands.get('spin');
    await spinCmd.execute(ctx, { commands });
  },
};
