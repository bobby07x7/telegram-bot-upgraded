const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'convert',
  description: 'Convert media between formats — /convert <target format> (as a reply to a file)',
  execute: async (ctx) => {
    const format = getArg(ctx);
    const msg = ctx.message.reply_to_message;
    if (!msg) return ctx.reply('↩️ Reply to a media file with /convert <format>');
    if (!format) return ctx.reply('Usage: /convert <format> (e.g. mp3, png, webp)');
    await ctx.reply(`🔄 Target format: ${format}. Wire up ffmpeg/sharp here to perform the actual conversion.`);
  },
};
