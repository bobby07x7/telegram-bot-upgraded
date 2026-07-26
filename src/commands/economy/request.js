const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'request',
  description: 'Ask another user for coins (reply to their message)',
  execute: async (ctx) => {
    const requester = ctx.from;
    const target = ctx.message.reply_to_message?.from;
    const amount = parseInt((ctx.message.text.split(' ')[1] || '').trim(), 10);

    if (!target) return ctx.reply('↩️ Reply to the user you want to request coins from.');
    if (!amount || amount <= 0) return ctx.reply('Usage: /request <amount> (as a reply)');

    await ctx.reply(
      `🙏 ${requester.first_name} is requesting ${amount}${config.economy.currencySymbol} from you, ${target.first_name}.\n` +
      `Use /send ${amount} in a reply to fulfil it.`
    );
  },
};
