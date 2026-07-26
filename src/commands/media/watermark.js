const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'watermark',
  description: 'Add a text watermark to a replied image — /watermark <text>',
  execute: async (ctx) => {
    const text = getArg(ctx);
    const msg = ctx.message.reply_to_message;
    if (!msg || !msg.photo) return ctx.reply('↩️ Reply to a photo with /watermark <text>');
    if (!text) return ctx.reply('Usage: /watermark <text> (as a reply to a photo)');
    await ctx.reply(`🖋️ Watermark text: "${text}". Wire up \`sharp\` or \`canvas\` here to draw it onto the image.`);
  },
};
