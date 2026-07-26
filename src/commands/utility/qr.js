const QRCode = require('qrcode');

module.exports = {
  name: 'qr',
  description: 'Generate a QR code — /qr <text or URL>',
  execute: async (ctx) => {
    const text = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!text) {
      await ctx.reply('❓ Usage: /qr <text or URL>');
      return;
    }
    const buffer = await QRCode.toBuffer(text, { width: 400 });
    await ctx.replyWithPhoto({ source: buffer }, { caption: '📱 Here is your QR code' });
  },
};
