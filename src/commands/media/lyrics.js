const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'lyrics',
  description: 'Get lyrics for a song — /lyrics <song name>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /lyrics <song name>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.searchLyrics(input);
      await ctx.reply(result.lyrics || `📄 No lyrics found for "${input}".`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
