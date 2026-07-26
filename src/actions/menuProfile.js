const { Markup } = require('telegraf');
const { getUser } = require('../database/store');
const { buildProfileText } = require('../core/profileCard');

module.exports = {
  id: 'menu:profile',
  handler: async (ctx) => {
    await ctx.answerCbQuery();
    const user = getUser(ctx.from.id);
    const text = buildProfileText(ctx.from.first_name, user);

    await ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.callback('⬅️ Back', 'menu:start'), Markup.button.callback('✖️ Close', 'menu:close')]]),
    });
  },
};
