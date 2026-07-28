const { logout } = require('../../core/adminSession');

module.exports = {
  name: 'logoutadmin',
  description: 'Lock owner & admin commands again for this session (undo /loginadmin)',
  execute: async (ctx) => {
    logout(ctx.from.id);
    await ctx.reply('🔒 Admin session locked. Use /loginadmin <password> to unlock again.');
  },
};
