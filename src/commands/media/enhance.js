const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'enhance',
  description: 'Upscale/enhance an image to HD — reply to a photo with /enhance',
  execute: async (ctx) => {
    const input = getArg(ctx);
    if (!input) return ctx.reply('Usage: reply to a photo with /enhance');

    await ctx.sendChatAction('upload_video');
    try {
      const result = await media.downloadYoutube(input);
      await ctx.reply(result.url);
    } catch (err) {
      await ctx.reply(`❌ ${err.message}`);
    }
  },
};
