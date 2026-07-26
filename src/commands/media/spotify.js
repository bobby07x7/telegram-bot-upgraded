const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'spotify',
  description: 'Search and download a track from Spotify — /spotify <song name>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /spotify <song name>');

    await ctx.sendChatAction('upload_voice');
    try {
      const result = await media.downloadSpotify(input);
      await ctx.reply(`🎧 Found on Spotify: ${result.title || input}\n\n(Configure MEDIA_API_BASE_URL to enable actual downloads.)`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
