const { getDb } = (() => {
  // Lightweight direct read to list known user IDs without exposing store internals further.
  const fs = require('fs');
  const path = require('path');
  const DB_PATH = path.join(__dirname, '..', '..', '..', 'storage', 'db.json');
  return {
    getDb: () => (fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) : { users: {} }),
  };
})();

module.exports = {
  name: 'broadcast',
  description: 'Send a message to every known user (owner only)',
  category: 'owner',
  ownerOnly: true,
  execute: async (ctx) => {
    const message = ctx.args?.join(' ');
    if (!message) return ctx.reply('Usage: `/broadcast <message>`', { parse_mode: 'Markdown' });

    const db = getDb();
    const userIds = Object.keys(db.users || {});
    let sent = 0, failed = 0;

    for (const id of userIds) {
      try {
        await ctx.telegram.sendMessage(id, `📢 *Announcement*\n\n${message}`, { parse_mode: 'Markdown' });
        sent++;
      } catch (_) {
        failed++;
      }
    }
    await ctx.reply(`✅ Broadcast sent to ${sent} users. Failed: ${failed}.`);
  },
};
