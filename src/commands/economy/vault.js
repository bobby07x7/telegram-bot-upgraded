const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'vault',
  description: 'View your total net worth (wallet + bank + inventory value)',
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const total = user.balance + user.bank;
    await ctx.reply(
      `🔐 *Vault Summary*\n\n💰 Wallet: ${user.balance}${config.economy.currencySymbol}\n🏦 Bank: ${user.bank}${config.economy.currencySymbol}\n📦 Items: ${user.inventory.length}\n\n*Total: ${total}${config.economy.currencySymbol}*`,
      { parse_mode: 'Markdown' }
    );
  },
};
