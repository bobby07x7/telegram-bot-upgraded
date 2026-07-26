const { config } = require('../config/config');
const { GACHA_POOL } = require('../database/items');

function rollRarity() {
  const rarities = config.gacha.rarities;
  const totalWeight = rarities.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const r of rarities) {
    if (roll < r.weight) return r;
    roll -= r.weight;
  }
  return rarities[0];
}

function rollItem() {
  const rarity = rollRarity();
  const pool = GACHA_POOL[rarity.key];
  const item = pool[Math.floor(Math.random() * pool.length)];
  return { ...item, rarityWeight: rarity.weight, label: rarity.label };
}

module.exports = { rollItem, rollRarity, GACHA_POOL };
