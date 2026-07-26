const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'music',
  description: 'Search and download a song by name — /music <song name>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /music <song name>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.searchYoutube(input);
      await ctx.reply(`🎵 Found: ${result.title || input}\n\n(Configure MEDIA_API_BASE_URL to enable actual downloads.)`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
