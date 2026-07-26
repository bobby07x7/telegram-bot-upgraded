const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'upload',
  description: 'Reply to a photo/video/document with this command to get a direct file link',
  execute: async (ctx) => {
    const msg = ctx.message.reply_to_message;
    if (!msg) return ctx.reply('↩️ Reply to a photo, video, or file with /upload.');

    const file = msg.photo?.[msg.photo.length - 1] || msg.video || msg.document || msg.audio;
    if (!file) return ctx.reply('❌ No supported media found in that message.');

    const link = await ctx.telegram.getFileLink(file.file_id);
    await ctx.reply(`🔗 ${link.href}`);
  },
};
