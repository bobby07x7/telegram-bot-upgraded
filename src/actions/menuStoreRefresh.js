const { getUser } = require('../database/store');

module.exports = {
  id: 'menu:store_refresh',
  handler: async (ctx, { commands }) => {
    await ctx.answerCbQuery();
    const shopCmd = commands.get('shop');
    const user = getUser(ctx.from.id);
    const { text, keyboard } = shopCmd.buildShopOverview(user);
    await ctx.editMessageText(text, { parse_mode: 'Markdown', ...keyboard });
  },
};
