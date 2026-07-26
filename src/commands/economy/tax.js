const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'tax',
  description: 'View the current transfer tax rate',
  execute: async (ctx) => {
    await ctx.reply(`🧾 Transfers over 1000${config.economy.currencySymbol} are taxed at ${config.economy.taxRate * 100}%.`);
  },
};
