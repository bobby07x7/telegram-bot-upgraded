const { buildStartMenu } = require('../../core/menuContent');
const { loading } = require('../../core/uiHelper');

module.exports = {
  name: 'start',
  description: 'Show the main menu',
  category: 'user',
  ownerOnly: false,
  execute: async (ctx, { config, commandLoader }) => {
    const msg = await loading(ctx, 'Loading menu');
    const view = buildStartMenu({ config, userId: ctx.from.id, commandLoader });
    await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, view.text, {
      parse_mode: 'Markdown',
      ...view.keyboard,
    });
  },
};
