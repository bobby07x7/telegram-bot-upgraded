const { Markup } = require('telegraf');
const { getUser } = require('../database/store');
const { buildWalletText } = require('../core/profileCard');

module.exports = {
  id: 'menu:wallet',
  handler: async (ctx) => {
    await ctx.answerCbQuery();
    const user = getUser(ctx.from.id);
    await ctx.editMessageText(buildWalletText(user), {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'menu:start'), Markup.button.callback('✖️ Close', 'menu:close')]]),
    });
  },
};
