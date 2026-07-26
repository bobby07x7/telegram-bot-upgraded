const { buildKeyboard, card, ICONS } = require('../../core/uiHelper');
const { isPrivileged } = require('../../core/menuContent');

module.exports = {
  name: 'panel',
  description: 'Owner control panel — broadcast, maintenance, admin tools',
  category: 'owner',
  ownerOnly: true, // menuContent.js + commandLoader both hide this from normal users
  execute: async (ctx, { config }) => {
    // Belt-and-suspenders check even though the menu/loader already hides it —
    // a normal user could still type /panel manually.
    if (!isPrivileged(ctx.from.id, config)) {
      return ctx.reply(`${ICONS.fail} Unknown command.`); // never reveal it exists
    }

    const text = card({
      icon: ICONS.owner,
      title: 'Owner Panel',
      lines: [
        '📢 Broadcast a message',
        '🛠️ Toggle maintenance mode',
        '👑 Manage bot admins',
        '💾 Run a backup',
      ],
    });
    const keyboard = buildKeyboard([
      [{ text: '📢 Broadcast', callback_data: 'owner:broadcast' }],
      [{ text: '🛠️ Maintenance', callback_data: 'owner:maintenance' }],
      [{ text: '👑 Admins', callback_data: 'owner:admins' }],
    ]);
    await ctx.reply(text, { parse_mode: 'Markdown', ...keyboard });
  },
};
