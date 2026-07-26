const { buildHelpOverviewText, getAvailableCategories } = require('../../core/menuContent');
const { buildCategoryKeyboard, withLoadingAnimation } = require('../../core/uiHelper');
const { isOwnerOrAdmin } = require('../../core/permissions');

module.exports = {
  name: 'help',
  description: 'Browse all commands by category',
  execute: async (ctx, { commands }) => {
    const viewer = { isGroup: ctx.chat.type !== 'private', isOwner: isOwnerOrAdmin(ctx.from.id) };
    const categories = getAvailableCategories(commands, viewer);
    const keyboard = buildCategoryKeyboard(categories, null);
    await withLoadingAnimation(ctx, buildHelpOverviewText(), keyboard);
  },
};
