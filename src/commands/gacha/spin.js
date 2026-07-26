const { getUser, saveUser } = require('../../database/store');
const { playAnimation, card } = require('../../core/uiHelper');

const POOL = [
  { name: 'Common Charm', rarity: 'Common', weight: 60, emoji: '⚪' },
  { name: 'Rare Gem', rarity: 'Rare', weight: 28, emoji: '🔵' },
  { name: 'Epic Relic', rarity: 'Epic', weight: 10, emoji: '🟣' },
  { name: 'Legendary Artifact', rarity: 'Legendary', weight: 2, emoji: '🟡' },
];
const SPIN_COST = 100;

function rollPool() {
  const total = POOL.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of POOL) {
    if (r < item.weight) return item;
    r -= item.weight;
  }
  return POOL[0];
}

module.exports = {
  name: 'spin',
  description: `Spin the gacha for ${SPIN_COST} coins`,
  category: 'gacha',
  ownerOnly: false,
  execute: async (ctx, { config }) => {
    const user = getUser(ctx.from.id, config);
    if (user.balance < SPIN_COST) {
      return ctx.reply(`❌ You need \`${SPIN_COST}\` coins to spin. You have \`${user.balance}\`.`, { parse_mode: 'Markdown' });
    }

    const result = rollPool();
    const msg = await ctx.reply('🎰 Spinning...');
    await playAnimation(ctx, msg, ['🎰 ⚪ ...', '🎰 🔵 ...', '🎰 🟣 ...', `🎰 ${result.emoji} ...`], { parse_mode: undefined });

    saveUser(ctx.from.id, {
      balance: user.balance - SPIN_COST,
      gacha: { pulls: user.gacha.pulls + 1, collection: [...user.gacha.collection, result.name] },
    });

    const text = card({
      icon: result.emoji,
      title: `You got: ${result.name}!`,
      lines: [`Rarity: *${result.rarity}*`, `Total pulls: \`${user.gacha.pulls + 1}\``],
    });
    await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, text, { parse_mode: 'Markdown' });
  },
};
