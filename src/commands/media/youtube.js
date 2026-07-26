const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'youtube',
  description: 'Download a video from a YouTube link — /youtube <url>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /youtube <url>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.downloadYoutube(input);
      await ctx.replyWithVideo(result.videoUrl || result.url).catch(() => ctx.reply(`✅ Ready: ${result.videoUrl || result.url}`));
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
