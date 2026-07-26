module.exports = {
  id: 'menu:store',
  handler: async (ctx, { commands }) => {
    await ctx.answerCbQuery();
    const shopCmd = commands.get('shop');
    await shopCmd.execute(ctx, { commands });
  },
};
