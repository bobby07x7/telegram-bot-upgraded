const { config } = require('../../config/config');

module.exports = {
  name: 'feedback',
  description: 'Send feedback to the bot owner — /feedback <message>',
  execute: async (ctx) => {
    const message = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!message) {
      await ctx.reply('❓ Usage: /feedback Your message here');
      return;
    }
    if (!config.bot.ownerId) {
      await ctx.reply('⚠️ Feedback forwarding is not configured (OWNER_ID missing in .env).');
      return;
    }
    await ctx.telegram.sendMessage(
      config.bot.ownerId,
      `📩 *New Feedback*\nFrom: ${ctx.from.first_name} (${ctx.from.id})\n\n${message}`,
      { parse_mode: 'Markdown' }
    );
    await ctx.reply('✅ Thanks! Your feedback has been sent to the developer.');
  },
};
