const { buildHelpOverviewText, getAvailableCategories } = require('../core/menuContent');
const { buildCategoryKeyboard } = require('../core/uiHelper');
const { isOwnerOrAdmin } = require('../core/permissions');

module.exports = {
  id: 'menu:help',
  handler: async (ctx, { commands }) => {
    await ctx.answerCbQuery();
    const viewer = { isGroup: ctx.chat.type !== 'private', isOwner: isOwnerOrAdmin(ctx.from.id) };
    const categories = getAvailableCategories(commands, viewer);
    await ctx.editMessageText(buildHelpOverviewText(), buildCategoryKeyboard(categories, null));
  },
};
