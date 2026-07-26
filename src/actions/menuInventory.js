module.exports = {
  id: 'menu:inventory',
  handler: async (ctx, { commands }) => {
    await ctx.answerCbQuery();
    const inventoryCmd = commands.get('inventory');
    await inventoryCmd.execute(ctx, { commands });
  },
};
