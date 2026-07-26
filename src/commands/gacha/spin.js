const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');
const { RARITY, displayName } = require('../../database/items');
const { playCasinoSpin } = require('../../core/uiHelper');

module.exports = {
  name: 'spin',
  description: 'Spin the gacha for a random item — full casino animation',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const today = new Date().toDateString();
    const lastSpinDay = user.lastSpin ? new Date(user.lastSpin).toDateString() : null;
    const spinsToday = lastSpinDay === today ? user.spinsToday : 0;
    const freeSpins = config.gacha.dailyFreeSpins + (user.referrals || 0);

    let cost = 0;
    if (spinsToday >= freeSpins) {
      cost = config.gacha.spinCost;
      if (user.balance < cost) {
        return ctx.reply(
          `❌ Out of free spins (${spinsToday}/${freeSpins} used today) and insufficient balance for a paid spin (${cost}${config.economy.currencySymbol}).`
        );
      }
    }

    const item = rollItem();
    saveUser(id, {
      balance: user.balance - cost,
      inventory: [...user.inventory, item.id],
      lastSpin: Date.now(),
      spinsToday: spinsToday + 1,
    });
    addHistory(id, { type: 'gacha spin', item: item.name, rarity: item.rarity });

    const rarity = RARITY[item.rarity];
    const costLine = cost > 0 ? `-${cost}${config.economy.currencySymbol}` : 'FREE SPIN';
    const spinsLeft = Math.max(0, freeSpins - (spinsToday + 1));

    const resultText =
      `╔═══════ 🎰 JACKPOT REVEAL ═══════╗\n` +
      `║\n` +
      `║      [ ${rarity.emoji} | ${rarity.emoji} | ${rarity.emoji} ]\n` +
      `║\n` +
      `║   ${displayName(item)}\n` +
      `║   ${rarity.emoji} *${rarity.label}* tier\n` +
      `║\n` +
      `║   💰 ${costLine}\n` +
      `║   🎟️ Free spins left today: ${spinsLeft}\n` +
      `╚══════════════════════════════╝\n\n` +
      `🎒 Added to /inventory — /equip it if it's gear!`;

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎰 NISHA CASINO');
  },
};
