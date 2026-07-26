const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'trade',
  description: 'Propose an item trade with another user — reply, @mention, or user id',
  execute: async (ctx) => {
    const { target, rest } = resolveTarget(ctx);
    if (!target) return ctx.reply('↩️ Reply to, or @mention, the user you want to trade with.\nUsage: /trade <your item> for <their item>');
    if (String(target.id) === String(ctx.from.id)) return ctx.reply('❌ You cannot trade with yourself.');

    const proposal = rest || 'an item trade';
    await ctx.reply(
      `🔄 Trade proposal sent to ${target.first_name || target.username || target.id}: "${proposal}"\n(Both users must confirm — feature in active development.)`
    );
  },
};
