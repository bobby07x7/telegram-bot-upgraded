const { buildHelpMenu } = require('../../core/menuContent');

module.exports = {
  name: 'help',
  description: 'List every command you have access to',
  category: 'user',
  ownerOnly: false,
  execute: async (ctx, { config, commandLoader }) => {
    const view = buildHelpMenu({ commandLoader, userId: ctx.from.id, config });
    await ctx.reply(view.text, { parse_mode: 'Markdown', ...view.keyboard });
  },
};
