const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'enable',
  description: 'Re-enable a previously disabled command — /enable <command name>',
  ownerOnly: true,
  execute: async (ctx) => {
    const name = (ctx.message.text.split(' ')[1] || '').trim().replace(/^\//, '');
    if (!name) return ctx.reply('Usage: /enable <command name>');
    const state = getState();
    saveState({ disabledCommands: state.disabledCommands.filter((c) => c !== name) });
    await ctx.reply(`✅ /${name} is enabled again.`);
  },
};
