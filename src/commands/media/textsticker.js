const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'textsticker',
  description: 'Turn text into a sticker-style image — /textsticker <text>',
  execute: async (ctx) => {
    const text = getArg(ctx);
    if (!text) return ctx.reply('Usage: /textsticker <text>');
    await ctx.reply(`✅ Text captured: "${text}"\n\n(Rendering text-to-image requires a canvas/sharp renderer — install \`node-canvas\` and plug it in here to generate the actual sticker image.)`);
  },
};
