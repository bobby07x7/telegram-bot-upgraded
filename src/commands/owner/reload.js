const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'reload',
  description: 'Hot-reload all commands and actions from disk without restarting',
  ownerOnly: true,
  execute: async (ctx, { commands }) => {
    const { loadCommands } = require('../../core/commandLoader');
    const fresh = loadCommands();
    commands.clear();
    for (const [key, value] of fresh) commands.set(key, value);
    await ctx.reply(`♻️ Reloaded ${commands.size} command(s) from disk.`);
  },
};
