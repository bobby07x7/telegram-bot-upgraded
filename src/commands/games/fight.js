const { fightAnimation } = require('../../core/uiHelper');

module.exports = {
  name: 'fight',
  description: 'Challenge someone to an animated fight',
  category: 'games',
  ownerOnly: false,
  execute: async (ctx) => {
    const attacker = ctx.from?.first_name || 'You';
    const target = ctx.message?.reply_to_message?.from?.first_name
      || ctx.args?.[0]
      || 'a wild opponent';

    const winner = Math.random() < 0.5 ? attacker : target;

    await fightAnimation(ctx, { attacker, defender: target, winner });
  },
};
