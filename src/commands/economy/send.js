const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { resolveTarget } = require('../../core/targetResolver');

module.exports = {
  name: 'send',
  description: 'Send coins to another user — reply, @mention, or /send <amount> <@user>',
  execute: async (ctx) => {
    const sender = ctx.from.id;
    const { target, rest } = resolveTarget(ctx);

    if (!target) return ctx.reply('↩️ Reply to, or @mention, the user you want to send coins to.\nUsage: /send <amount>');
    if (String(target.id) === String(sender)) return ctx.reply('❌ You cannot send coins to yourself.');

    const amount = parseInt((rest.split(' ')[0] || '').trim(), 10);
    if (!amount || amount <= 0) return ctx.reply('Usage: /send <amount> (as a reply or @mention)');

    const senderData = getUser(sender);
    if (amount > senderData.balance) return ctx.reply('❌ Insufficient wallet balance.');

    const tax = amount > 1000 ? Math.floor(amount * config.economy.taxRate) : 0;
    const receiveAmount = amount - tax;

    const receiverData = getUser(target.id);
    saveUser(sender, { balance: senderData.balance - amount });
    saveUser(target.id, { balance: receiverData.balance + receiveAmount });
    addHistory(sender, { type: 'send', amount: -amount, to: target.id });
    addHistory(target.id, { type: 'received', amount: receiveAmount, from: sender });

    let msg = `✅ Sent ${receiveAmount}${config.economy.currencySymbol} to ${target.first_name || target.username || target.id}.`;
    if (tax > 0) msg += `\n(Tax: ${tax}${config.economy.currencySymbol} on transfers over 1000)`;
    await ctx.reply(msg);
  },
};
