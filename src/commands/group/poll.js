const { getGroup, saveGroup } = require('../../database/store');

module.exports = {
  name: 'poll',
  description: 'Create a poll — /poll <question> | <option1> | <option2> | ...',
  execute: async (ctx) => {
    const raw = ctx.message.text.split(' ').slice(1).join(' ');
    const parts = raw.split('|').map((p) => p.trim()).filter(Boolean);
    if (parts.length < 3) return ctx.reply('Usage: /poll <question> | <option1> | <option2> | ...');
    const [question, ...options] = parts;
    await ctx.telegram.sendPoll(ctx.chat.id, question, options.slice(0, 10));
  },
};
