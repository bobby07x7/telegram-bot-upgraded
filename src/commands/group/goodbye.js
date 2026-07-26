const { getGroup, saveGroup } = require('../../database/store');
const { requireGroupAdmin } = require('../../core/permissions');

module.exports = {
  name: 'goodbye',
  description: 'Set or view the goodbye message for leaving members — /goodbye <message>',
  execute: async (ctx) => {
    const text = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    const group = getGroup(ctx.chat.id);

    if (!text) return ctx.reply(`👋 Current goodbye message:\n\n${group.goodbyeMessage || '(default) Goodbye, {name}!'}`);
    if (!(await requireGroupAdmin(ctx))) return;
    saveGroup(ctx.chat.id, { goodbyeMessage: text });
    await ctx.reply('✅ Goodbye message updated.');
  },
};
