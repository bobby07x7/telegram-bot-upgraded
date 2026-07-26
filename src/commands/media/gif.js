const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'gif',
  description: 'Search for a GIF — /gif <search term>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /gif <search term>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.searchYoutube(input);
      await ctx.reply('🔎 Searching GIFs is best done via Telegram\'s built-in GIF search (the emoji icon next to the message box) or the Tenor/Giphy API — plug a key into mediaService.js to automate this.');
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
