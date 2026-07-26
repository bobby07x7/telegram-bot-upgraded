const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'instagram',
  description: 'Download a video/photo from an Instagram link — /instagram <url>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /instagram <url>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.downloadInstagram(input);
      await ctx.reply(`✅ Ready: ${result.mediaUrl || result.url}`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
