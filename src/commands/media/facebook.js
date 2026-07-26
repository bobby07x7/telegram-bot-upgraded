const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'facebook',
  description: 'Download a video from a Facebook link — /facebook <url>',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: /facebook <url>');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.downloadFacebook(input);
      await ctx.reply(`✅ Ready: ${result.mediaUrl || result.url}`);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
