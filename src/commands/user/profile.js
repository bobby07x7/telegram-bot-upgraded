const { getUser } = require('../../database/store');
const { card, progressBar, ICONS } = require('../../core/uiHelper');

module.exports = {
  name: 'profile',
  description: 'View your profile card',
  category: 'user',
  ownerOnly: false,
  execute: async (ctx, { config }) => {
    const user = getUser(ctx.from.id, config);
    const xpForNext = user.level * 100;
    const pct = Math.min(100, Math.round((user.xp / xpForNext) * 100));

    const text = card({
      icon: ICONS.user,
      title: `${ctx.from.first_name}'s Profile`,
      lines: [
        `💰 Wallet: \`${user.balance}\` coins`,
        `🏦 Bank: \`${user.bank}\` coins`,
        `⭐ Level ${user.level}  (${user.xp}/${xpForNext} XP)`,
        progressBar(pct),
        `🎰 Gacha pulls: \`${user.gacha.pulls}\``,
      ],
    });
    await ctx.reply(text, { parse_mode: 'Markdown' });
  },
};
