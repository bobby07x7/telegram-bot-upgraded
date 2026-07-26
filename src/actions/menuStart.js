const { buildStartText } = require('../core/menuContent');
const { buildStartKeyboard } = require('../core/uiHelper');
const { isOwnerOrAdmin } = require('../core/permissions');

module.exports = {
  id: 'menu:start',
  handler: async (ctx, { commands }) => {
    await ctx.answerCbQuery();
    const botInfo = await ctx.telegram.getMe();
    const isGroup = ctx.chat.type !== 'private';
    const viewer = { isGroup, isOwner: isOwnerOrAdmin(ctx.from.id) };
    await ctx.editMessageText(buildStartText(ctx, commands, viewer), {
      parse_mode: 'Markdown',
      ...buildStartKeyboard(botInfo.username, isGroup),
    });
  },
};
