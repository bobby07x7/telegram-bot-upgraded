const { config } = require('../config/config');
const { displayName } = require('../database/items');

module.exports = {
  // Matches callback_data like "buy:sword", "buy:petdragon"
  id: /^buy:(.+)$/,
  handler: async (ctx, { commands }) => {
    const itemId = ctx.match[1];
    const buyCmd = commands.get('buy');
    const result = buyCmd.purchaseItem(ctx.from.id, itemId);

    if (!result.ok) return ctx.answerCbQuery(result.message.replace(/^❌\s*/, ''), { show_alert: true });

    await ctx.answerCbQuery(`✅ Bought ${result.item.name}!`);
    await ctx.reply(
      `✅ *Purchase complete!*\n${displayName(result.item)} has been added to your /inventory.\n💰 -${result.item.price}${config.economy.currencySymbol}`,
      { parse_mode: 'Markdown' }
    );
  },
};
