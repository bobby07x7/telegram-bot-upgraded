const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'ytaudio',
  description: 'Download audio-only from a YouTube link — /ytaudio <url>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /ytaudio <url>');

    await ctx.sendChatAction('upload_voice');
    try {
      const result = await media.downloadYoutubeAudio(input);
      await ctx.replyWithAudio(result.audioUrl || result.url).catch(() => ctx.reply(`✅ Ready: ${result.audioUrl || result.url}`));
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
