// Central item catalog. Every item that can exist in a user's inventory —
// whether bought from /shop or won from /spin — is defined here once, with
// a stable `id` so the equip system, gifting, trading, and selling all agree
// on what an item is worth and what slot it goes in.
//
// slot: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'collectible' | null
// (null = purely cosmetic/collectible, cannot be equipped)

const RARITY = {
  common: { label: 'Common', emoji: '⚪', color: '#B0B0B0', weight: 55 },
  uncommon: { label: 'Uncommon', emoji: '🟢', color: '#3ADB3A', weight: 25 },
  rare: { label: 'Rare', emoji: '🔵', color: '#3A8CFF', weight: 12 },
  epic: { label: 'Epic', emoji: '🟣', color: '#B84AFF', weight: 6 },
  legendary: { label: 'Legendary', emoji: '🟡', color: '#FFD24A', weight: 2 },
};

// Shop = buyable with coins directly. Gacha = only obtainable via /spin.
const ITEMS = {
  // ── Shop items ──────────────────────────────────────────
  sword: { id: 'sword', name: 'Iron Sword', emoji: '⚔️', slot: 'weapon', rarity: 'common', price: 500, source: 'shop' },
  shield: { id: 'shield', name: 'Wooden Shield', emoji: '🛡️', slot: 'armor', rarity: 'common', price: 350, source: 'shop' },
  potion: { id: 'potion', name: 'Health Potion', emoji: '🧪', slot: 'consumable', rarity: 'common', price: 100, source: 'shop' },
  ring: { id: 'ring', name: 'Lucky Ring', emoji: '💍', slot: 'accessory', rarity: 'uncommon', price: 1200, source: 'shop' },
  crown: { id: 'crown', name: 'Golden Crown', emoji: '👑', slot: 'accessory', rarity: 'legendary', price: 5000, source: 'shop' },
  cape: { id: 'cape', name: 'Shadow Cape', emoji: '🧥', slot: 'armor', rarity: 'rare', price: 2200, source: 'shop' },
  amulet: { id: 'amulet', name: 'Guardian Amulet', emoji: '📿', slot: 'accessory', rarity: 'epic', price: 3500, source: 'shop' },

  // ── Gacha-only items (won from /spin, /multispin) ────────
  wsword: { id: 'wsword', name: 'Wooden Sword', emoji: '🪵', slot: 'weapon', rarity: 'common', source: 'gacha' },
  boots: { id: 'boots', name: 'Leather Boots', emoji: '🥾', slot: 'armor', rarity: 'common', source: 'gacha' },
  bread: { id: 'bread', name: 'Bread', emoji: '🍞', slot: 'consumable', rarity: 'common', source: 'gacha' },
  torch: { id: 'torch', name: 'Torch', emoji: '🔥', slot: null, rarity: 'common', source: 'gacha' },
  rope: { id: 'rope', name: 'Rope', emoji: '🪢', slot: null, rarity: 'common', source: 'gacha' },
  ishield: { id: 'ishield', name: 'Iron Shield', emoji: '🛡️', slot: 'armor', rarity: 'uncommon', source: 'gacha' },
  sring: { id: 'sring', name: 'Silver Ring', emoji: '💍', slot: 'accessory', rarity: 'uncommon', source: 'gacha' },
  hpotion: { id: 'hpotion', name: 'Health Potion', emoji: '🧪', slot: 'consumable', rarity: 'uncommon', source: 'gacha' },
  scroll: { id: 'scroll', name: 'Magic Scroll', emoji: '📜', slot: null, rarity: 'uncommon', source: 'gacha' },
  ebow: { id: 'ebow', name: 'Enchanted Bow', emoji: '🏹', slot: 'weapon', rarity: 'rare', source: 'gacha' },
  camulet: { id: 'camulet', name: 'Crystal Amulet', emoji: '💎', slot: 'accessory', rarity: 'rare', source: 'gacha' },
  dscale: { id: 'dscale', name: 'Dragon Scale', emoji: '🐲', slot: 'armor', rarity: 'rare', source: 'gacha' },
  pfeather: { id: 'pfeather', name: 'Phoenix Feather', emoji: '🪶', slot: 'accessory', rarity: 'epic', source: 'gacha' },
  vblade: { id: 'vblade', name: 'Void Blade', emoji: '🗡️', slot: 'weapon', rarity: 'epic', source: 'gacha' },
  tgauntlet: { id: 'tgauntlet', name: 'Titan Gauntlet', emoji: '🥊', slot: 'armor', rarity: 'epic', source: 'gacha' },
  excalibur: { id: 'excalibur', name: 'Excalibur', emoji: '⚡', slot: 'weapon', rarity: 'legendary', source: 'gacha' },
  igem: { id: 'igem', name: 'Infinity Gem', emoji: '♾️', slot: 'accessory', rarity: 'legendary', source: 'gacha' },
  kheart: { id: 'kheart', name: "Kraken's Heart", emoji: '🐙', slot: 'accessory', rarity: 'legendary', source: 'gacha' },
};

const SHOP_ITEMS = Object.values(ITEMS).filter((i) => i.source === 'shop');
const GACHA_POOL = {
  common: Object.values(ITEMS).filter((i) => i.source === 'gacha' && i.rarity === 'common'),
  uncommon: Object.values(ITEMS).filter((i) => i.source === 'gacha' && i.rarity === 'uncommon'),
  rare: Object.values(ITEMS).filter((i) => i.source === 'gacha' && i.rarity === 'rare'),
  epic: Object.values(ITEMS).filter((i) => i.source === 'gacha' && i.rarity === 'epic'),
  legendary: Object.values(ITEMS).filter((i) => i.source === 'gacha' && i.rarity === 'legendary'),
};

function getItem(id) {
  return ITEMS[id] || null;
}

/**
 * Resolves a user-typed string to an item — matches by exact id first,
 * then by case-insensitive name/partial-name (keeps old commands that
 * accept "sword" or "Iron Sword" both working).
 */
function findItem(query) {
  if (!query) return null;
  const q = String(query).trim().toLowerCase();
  if (ITEMS[q]) return ITEMS[q];
  return (
    Object.values(ITEMS).find((i) => i.name.toLowerCase() === q) ||
    Object.values(ITEMS).find((i) => i.name.toLowerCase().includes(q)) ||
    null
  );
}

function displayName(item) {
  return `${item.emoji} ${item.name}`;
}

module.exports = { ITEMS, SHOP_ITEMS, GACHA_POOL, RARITY, getItem, findItem, displayName };
