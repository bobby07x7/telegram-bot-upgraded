const { getGroup, saveGroup } = require('../../database/store');

module.exports = {
  name: 'report',
  description: 'Report a message to the admins (reply to the offending message)',
  execute: async (ctx) => {
    const reported = ctx.message.reply_to_message;
    if (!reported) return ctx.reply('↩️ Reply to the message you want to report.');
    const admins = await ctx.telegram.getChatAdministrators(ctx.chat.id);
    const mentions = admins.filter((a) => !a.user.is_bot).map((a) => `[${a.user.first_name}](tg://user?id=${a.user.id})`);
    await ctx.reply(`🚨 ${mentions.join(' ')} — message reported by ${ctx.from.first_name}.`, {
      parse_mode: 'Markdown',
      reply_to_message_id: reported.message_id,
    });
  },
};
