const { readState, writeState } = require('../../database/botState');
const { card, ICONS } = require('../../core/uiHelper');

module.exports = {
  name: 'maintenance',
  description: 'Toggle maintenance mode (owner only)',
  category: 'owner',
  ownerOnly: true,
  execute: async (ctx, { config }) => {
    const state = readState();
    const next = !state.maintenanceMode;
    writeState({ maintenanceMode: next });
    config.maintenanceMode = next; // reflect immediately in-memory

    const text = card({
      icon: ICONS.owner,
      title: 'Maintenance Mode',
      lines: [`Status: ${next ? '🛠️ ON — normal users blocked' : '✅ OFF — bot fully live'}`],
    });
    await ctx.reply(text, { parse_mode: 'Markdown' });
  },
};
