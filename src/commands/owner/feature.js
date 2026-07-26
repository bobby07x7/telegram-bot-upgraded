const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'feature',
  description: 'Toggle a custom feature flag — /feature <name> on|off',
  ownerOnly: true,
  execute: async (ctx) => {
    const [, name, value] = ctx.message.text.split(' ');
    if (!name || !['on', 'off'].includes(value)) return ctx.reply('Usage: /feature <name> on|off');
    const state = getState();
    saveState({ featureFlags: { ...state.featureFlags, [name]: value === 'on' } });
    await ctx.reply(`✅ Feature "${name}" set to ${value.toUpperCase()}.`);
  },
};
