const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'twitter',
  description: 'Download a video from a Twitter/X link — /twitter <url>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /twitter <url>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.downloadTwitter(input);
      await ctx.reply(`✅ Ready: ${result.mediaUrl || result.url}`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
