const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { redeemCode } = require('../../core/codeStore');
const { findItem, displayName } = require('../../database/items');

module.exports = {
  name: 'redeem',
  description: 'Redeem a code created by the owner — /redeem <code>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const code = (ctx.message.text.split(' ')[1] || '').trim();
    if (!code) return ctx.reply('Usage: /redeem <code>');

    const result = redeemCode(code, id);
    if (!result.ok) return ctx.reply(`❌ ${result.reason}`);

    const user = getUser(id);
    const entry = result.code;

    if (entry.type === 'coins') {
      saveUser(id, { balance: user.balance + entry.value });
      addHistory(id, { type: 'code redeemed', code: code.toUpperCase(), amount: entry.value });
      await ctx.reply(`✅ Redeemed \`${code.toUpperCase()}\`: +${entry.value}${config.economy.currencySymbol}`, { parse_mode: 'Markdown' });
    } else {
      const item = findItem(entry.value);
      const label = item ? displayName(item) : entry.value;
      saveUser(id, { inventory: [...user.inventory, entry.value] });
      addHistory(id, { type: 'code redeemed', code: code.toUpperCase(), item: entry.value });
      await ctx.reply(`✅ Redeemed \`${code.toUpperCase()}\`: received ${label}!`, { parse_mode: 'Markdown' });
    }
  },
};
