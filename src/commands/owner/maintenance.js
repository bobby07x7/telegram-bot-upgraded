const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'maintenance',
  description: 'Toggle maintenance mode (blocks all non-owner commands)',
  ownerOnly: true,
  execute: async (ctx) => {
    const state = getState();
    const newValue = !state.maintenance;
    saveState({ maintenance: newValue });
    await ctx.reply(`🛠️ Maintenance mode is now ${newValue ? 'ON — only owner/admins can use commands.' : 'OFF — bot fully available.'}`);
  },
};
