const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'resize',
  description: 'Resize a replied image — /resize <width>x<height>',
  execute: async (ctx) => {
    const dims = getArg(ctx);
    const msg = ctx.message.reply_to_message;
    if (!msg || !msg.photo) return ctx.reply('↩️ Reply to a photo with /resize <width>x<height>');
    if (!/^\d+x\d+$/.test(dims)) return ctx.reply('Usage: /resize <width>x<height> (e.g. 512x512)');
    await ctx.reply(`📐 Resize target: ${dims}. Wire up the \`sharp\` package here to perform the actual resize.`);
  },
};
