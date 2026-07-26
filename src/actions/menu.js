const { buildStartMenu, buildCategoryMenu, buildHelpMenu } = require('../core/menuContent');

module.exports = {
  pattern: /^menu:(start|help|cat:(\w+))$/,
  handle: async (ctx, { config, commandLoader }) => {
    const data = ctx.callbackQuery.data;
    let view;

    if (data === 'menu:start') {
      view = buildStartMenu({ config, userId: ctx.from.id, commandLoader });
    } else if (data === 'menu:help') {
      view = buildHelpMenu({ commandLoader, userId: ctx.from.id, config });
    } else {
      const category = data.split(':')[2];
      view = buildCategoryMenu({ category, commandLoader, userId: ctx.from.id, config });
    }

    await ctx.editMessageText(view.text, { parse_mode: 'Markdown', ...view.keyboard });
  },
};
