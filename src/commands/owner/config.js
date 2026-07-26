const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'config',
  description: 'View the bot\'s current runtime configuration (non-sensitive values)',
  ownerOnly: true,
  execute: async (ctx, { config }) => {
    const state = getState();
    await ctx.reply(
      `⚙️ *Runtime Config*\n\n` +
      `Bot name: ${config.bot_meta.name}\n` +
      `Environment: ${config.env}\n` +
      `Maintenance: ${state.maintenance}\n` +
      `Extra admins: ${state.extraAdmins.length}\n` +
      `Disabled commands: ${state.disabledCommands.length}`,
      { parse_mode: 'Markdown' }
    );
  },
};
