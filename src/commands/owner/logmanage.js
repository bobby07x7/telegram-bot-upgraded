const { getState, saveState } = require('../../database/botState');

module.exports = {
  name: 'logmanage',
  description: "Owner-only: control which users' /start gets posted to the log group — /logmanage <add|remove|list> [user_id] (or reply)",
  ownerOnly: true,
  execute: async (ctx) => {
    const args = ctx.message.text.split(' ').slice(1);
    const sub = (args[0] || '').toLowerCase();
    const state = getState();

    if (sub === 'list') {
      if (!state.logIgnoreList.length) return ctx.reply('📋 No users are currently excluded from logging. Everyone gets logged.');
      return ctx.reply(`📋 *Excluded from logging:*\n${state.logIgnoreList.map((id) => `• \`${id}\``).join('\n')}`, { parse_mode: 'Markdown' });
    }

    const target = ctx.message.reply_to_message?.from;
    const userId = target ? String(target.id) : (args[1] || '').trim();

    if (!['add', 'remove'].includes(sub) || !userId) {
      return ctx.reply(
        '⚠️ Usage:\n' +
        '/logmanage add <user_id> — stop logging this user (or reply to them)\n' +
        '/logmanage remove <user_id> — resume logging this user\n' +
        '/logmanage list — show excluded users'
      );
    }

    if (sub === 'add') {
      if (state.logIgnoreList.includes(userId)) return ctx.reply('❌ Already excluded from logging.');
      saveState({ logIgnoreList: [...state.logIgnoreList, userId] });
      return ctx.reply(`🔕 User ${userId} will no longer be logged when they start the bot.`);
    }

    if (!state.logIgnoreList.includes(userId)) return ctx.reply('❌ That user was not excluded.');
    saveState({ logIgnoreList: state.logIgnoreList.filter((id) => id !== userId) });
    await ctx.reply(`🔔 User ${userId} will be logged again.`);
  },
};
