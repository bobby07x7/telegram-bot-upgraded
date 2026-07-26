const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'welcome',
  description: 'Set or view the welcome message for new members — /welcome <message>',
  execute: async (ctx) => {
    const text = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    const group = getGroup(ctx.chat.id);

    if (!text) return ctx.reply(`👋 Current welcome message:\n\n${group.welcomeMessage || '(default) Welcome to the group, {name}!'}`);
    if (!(await requireGroupAdmin(ctx))) return;
    saveGroup(ctx.chat.id, { welcomeMessage: text });
    await ctx.reply('✅ Welcome message updated. Use {name} as a placeholder for the new member\'s name.');
  },
};
