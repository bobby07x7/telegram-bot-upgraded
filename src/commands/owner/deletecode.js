const { deleteCode } = require('../../core/codeStore');

module.exports = {
  name: 'deletecode',
  description: 'Delete/revoke a redeem code — /deletecode <CODE>',
  ownerOnly: true,
  execute: async (ctx) => {
    const code = (ctx.message.text.split(' ')[1] || '').trim();
    if (!code) return ctx.reply('Usage: /deletecode <CODE>');

    const removed = deleteCode(code);
    if (!removed) return ctx.reply(`❌ No code found matching \`${code.toUpperCase()}\`.`, { parse_mode: 'Markdown' });

    await ctx.reply(`🗑️ Code \`${code.toUpperCase()}\` deleted. It can no longer be redeemed.`, { parse_mode: 'Markdown' });
  },
};
