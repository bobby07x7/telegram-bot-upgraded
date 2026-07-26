const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'broadcast',
  description: 'Send a message to every user who has ever messaged the bot',
  ownerOnly: true,
  execute: async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!text) return ctx.reply('Usage: /broadcast <message>');

    const ids = getAllUserIds();
    let sent = 0;
    let failed = 0;
    for (const id of ids) {
      try {
        await ctx.telegram.sendMessage(id, `📢 *Announcement*\n\n${text}`, { parse_mode: 'Markdown' });
        sent++;
      } catch (_) {
        failed++;
      }
    }
    await ctx.reply(`✅ Broadcast complete. Sent: ${sent}, Failed/blocked: ${failed}`);
  },
};
