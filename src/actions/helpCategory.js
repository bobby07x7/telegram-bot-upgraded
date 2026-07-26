const { buildCategoryText, getAvailableCategories } = require('../core/menuContent');
const { buildCategoryKeyboard } = require('../core/uiHelper');
const { isOwnerOrAdmin } = require('../core/permissions');

module.exports = {
  // Matches callback_data like "help:utility", "help:economy", etc.
  id: /^help:(.+)$/,
  handler: async (ctx, { commands }) => {
    const categoryKey = ctx.match[1];
    await ctx.answerCbQuery();
    const viewer = { isGroup: ctx.chat.type !== 'private', isOwner: isOwnerOrAdmin(ctx.from.id) };
    const categories = getAvailableCategories(commands, viewer);
    await ctx.editMessageText(buildCategoryText(categoryKey, commands, viewer), {
      parse_mode: 'Markdown',
      ...buildCategoryKeyboard(categories, categoryKey),
    });
  },
};
