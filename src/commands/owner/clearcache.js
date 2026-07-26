const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'clearcache',
  description: 'Clear Node\'s require cache for all command/action files (useful after manual file edits)',
  ownerOnly: true,
  execute: async (ctx) => {
    const { COMMANDS_DIR } = require('../../core/commandLoader');
    const { ACTIONS_DIR } = require('../../core/actionLoader');
    let cleared = 0;
    for (const key of Object.keys(require.cache)) {
      if (key.startsWith(COMMANDS_DIR) || key.startsWith(ACTIONS_DIR)) {
        delete require.cache[key];
        cleared++;
      }
    }
    await ctx.reply(`🧹 Cleared ${cleared} cached module(s). Run /reload to re-register commands.`);
  },
};
