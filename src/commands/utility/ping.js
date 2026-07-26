const { pingAnimation } = require('../../core/uiHelper');

module.exports = {
  name: 'ping',
  description: 'Check bot latency with a live animation',
  category: 'utility',
  ownerOnly: false,
  execute: async (ctx) => {
    const apiStart = Date.now();
    await ctx.telegram.getMe(); // cheap round-trip to Telegram's API
    const apiMs = Date.now() - apiStart;

    await pingAnimation(ctx, async () => ({ apiMs }));
  },
};
