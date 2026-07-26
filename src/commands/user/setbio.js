const { saveUser } = require('../../database/store');

module.exports = {
  name: 'setbio',
  description: 'Set your profile bio — /setbio <text>',
  execute: async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!text) {
      await ctx.reply('❓ Usage: /setbio Your bio text here');
      return;
    }
    if (text.length > 150) {
      await ctx.reply('❌ Bio must be 150 characters or fewer.');
      return;
    }
    saveUser(ctx.from.id, { bio: text });
    await ctx.reply('✅ Bio updated!');
  },
};
