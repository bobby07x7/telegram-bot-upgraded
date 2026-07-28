const { isOwnerOrAdminRole } = require('../../core/permissions');
const { login } = require('../../core/adminSession');
const { config } = require('../../config/config');

module.exports = {
  name: 'loginadmin',
  description: 'Owner/admin: unlock all owner & admin commands (and menus) for this session — /loginadmin <password>',
  execute: async (ctx) => {
    if (!isOwnerOrAdminRole(ctx.from.id)) {
      return ctx.reply('🚫 You are not registered as an owner or admin of this bot.');
    }
    if (!config.security.adminPassword) {
      return ctx.reply(
        '⚠️ No admin password is configured, so there is nothing to unlock — ' +
        'your owner/admin status already works normally.\n\n' +
        'Set ADMIN_PASSWORD in your .env to turn on the login lock.'
      );
    }

    const password = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!password) return ctx.reply('⚠️ Usage: /loginadmin <password>');

    // Try to remove the password from chat history either way — best effort.
    try { await ctx.deleteMessage(); } catch (_) { /* no delete rights, ignore */ }

    if (password !== config.security.adminPassword) {
      return ctx.reply('❌ Wrong password.');
    }

    login(ctx.from.id);
    const minutes = Math.round(config.security.adminSessionMs / 60000);
    await ctx.reply(
      `✅ *Admin unlocked!*\n\nAll owner/admin commands and menus will work for you for the next ~${minutes} minutes.\nUse /logoutadmin to lock again early.`,
      { parse_mode: 'Markdown' }
    );
  },
};
