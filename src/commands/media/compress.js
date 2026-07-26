const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'compress',
  description: 'Compress a replied video/image file to reduce size',
  execute: async (ctx) => {
    const msg = ctx.message.reply_to_message;
    if (!msg || !(msg.video || msg.photo)) return ctx.reply('↩️ Reply to a video or photo with /compress.');
    await ctx.reply('🗜️ Compression requires an ffmpeg/sharp processing pipeline. Install ffmpeg on your server and wire it up here to enable this.');
  },
};
