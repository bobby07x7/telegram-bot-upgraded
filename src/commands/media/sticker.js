const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'sticker',
  description: 'Convert a replied photo into a sticker',
  execute: async (ctx) => {
    const msg = ctx.message.reply_to_message;
    const photo = msg?.photo?.[msg.photo.length - 1];
    if (!photo) return ctx.reply('↩️ Reply to a photo with /sticker to convert it.');

    try {
      await ctx.replyWithSticker(photo.file_id);
    } catch (err) {
      await ctx.reply('❌ Telegram requires stickers in WEBP format at specific dimensions. Photo-to-sticker conversion needs an image-processing step (e.g. sharp) before sending — see README for the sharp integration snippet.');
    }
  },
};
