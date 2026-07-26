const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'disable',
  description: 'Disable a command bot-wide (except for owner/admins) — /disable <command name>',
  ownerOnly: true,
  execute: async (ctx) => {
    const name = (ctx.message.text.split(' ')[1] || '').trim().replace(/^\//, '');
    if (!name) return ctx.reply('Usage: /disable <command name>');
    const state = getState();
    saveState({ disabledCommands: [...new Set([...state.disabledCommands, name])] });
    await ctx.reply(`⛔ /${name} is now disabled bot-wide.`);
  },
};
