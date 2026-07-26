const { buildStartText } = require('../../core/menuContent');
const { buildStartKeyboard, withLoadingAnimation } = require('../../core/uiHelper');
const { isOwnerOrAdmin } = require('../../core/permissions');

module.exports = {
  name: 'start',
  description: 'Start the bot and open the main menu',
  execute: async (ctx, { commands }) => {
    const botInfo = await ctx.telegram.getMe();
    const isGroup = ctx.chat.type !== 'private';
    const viewer = { isGroup, isOwner: isOwnerOrAdmin(ctx.from.id) };
    const text = buildStartText(ctx, commands, viewer);
    const keyboard = buildStartKeyboard(botInfo.username, isGroup);

    const frames = ['🎰 Starting up', '🎰 Starting up.', '🎰 Starting up..', '🎰 Starting up...', '✨ Almost ready...'];
    await withLoadingAnimation(ctx, text, { parse_mode: 'Markdown', ...keyboard }, frames, 320);
  },
};
