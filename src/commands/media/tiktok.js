const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'tiktok',
  description: 'Download a TikTok video without watermark — /tiktok <url>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /tiktok <url>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.downloadTiktok(input);
      await ctx.replyWithVideo(result.videoUrl || result.url).catch(() => ctx.reply(`✅ Ready: ${result.videoUrl || result.url}`));
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
