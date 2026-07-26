const { getUser, saveUser } = require('../../database/store');
const { loading, card, ICONS } = require('../../core/uiHelper');

const DAY_MS = 24 * 60 * 60 * 1000;

module.exports = {
  name: 'daily',
  description: 'Claim your daily coin reward',
  category: 'user',
  ownerOnly: false,
  execute: async (ctx, { config }) => {
    const msg = await loading(ctx, 'Checking your daily claim');
    const user = getUser(ctx.from.id, config);
    const now = Date.now();

    if (now - user.lastDaily < DAY_MS) {
      const remaining = DAY_MS - (now - user.lastDaily);
      const hours = Math.ceil(remaining / (60 * 60 * 1000));
      return ctx.telegram.editMessageText(
        msg.chat.id, msg.message_id, undefined,
        `${ICONS.warn} Already claimed. Come back in ~${hours}h.`
      );
    }

    const reward = config.economy.dailyReward;
    saveUser(ctx.from.id, { balance: user.balance + reward, lastDaily: now });

    const text = card({
      icon: '🎁',
      title: 'Daily Reward Claimed!',
      lines: [`+\`${reward}\` coins`, `New balance: \`${user.balance + reward}\``],
    });
    await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, text, { parse_mode: 'Markdown' });
  },
};
