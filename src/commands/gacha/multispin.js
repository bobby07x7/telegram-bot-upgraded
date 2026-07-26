const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');
const { RARITY, displayName } = require('../../database/items');
const { playCasinoSpin } = require('../../core/uiHelper');

module.exports = {
  name: 'multispin',
  description: 'Spin the gacha 5 times at once (paid spins only) — casino animation',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const user = getUser(id);
    const totalCost = config.gacha.spinCost * 5;
    if (user.balance < totalCost) {
      return ctx.reply(`❌ Multispin (5x) costs ${totalCost}${config.economy.currencySymbol}. You have ${user.balance}${config.economy.currencySymbol}.`);
    }

    const results = [];
    for (let i = 0; i < 5; i++) results.push(rollItem());

    const newInventory = [...user.inventory, ...results.map((r) => r.id)];
    saveUser(id, { balance: user.balance - totalCost, inventory: newInventory });
    addHistory(id, { type: 'gacha multispin', items: results.map((r) => r.name) });

    const best = results.reduce((a, b) => (b.rarityWeight < a.rarityWeight ? b : a));
    const lines = results.map((r) => {
      const rarity = RARITY[r.rarity];
      return `║   ${displayName(r)}  ${rarity.emoji} ${rarity.label}`;
    });

    const resultText =
      `╔═══════ 🎰 5x MULTISPIN ═══════╗\n` +
      `║\n` +
      `${lines.join('\n')}\n` +
      `║\n` +
      `║   🌟 Best pull: ${RARITY[best.rarity].label}\n` +
      `║   💰 -${totalCost}${config.economy.currencySymbol}\n` +
      `╚══════════════════════════════╝\n\n` +
      `🎒 All 5 items added to /inventory!`;

    await playCasinoSpin(ctx, resultText, { parse_mode: 'Markdown' }, '🎰 NISHA CASINO x5');
  },
};
