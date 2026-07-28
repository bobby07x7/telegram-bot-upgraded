const { getUser, saveUser } = require('../database/store');

const MAX_LEVEL = 20;
const LEVEL_SAFE_THRESHOLD = 10; // upgrades above this can fail
const REFINE_TIERS = ['normal', 'fine', 'rare', 'epic', 'legendary'];
const EVOLUTION_PREFIXES = ['', 'Ancient', 'Celestial', 'Infinity'];
const ENCHANTS = [
  { id: 'burn', label: '🔥 Burn' },
  { id: 'freeze', label: '❄️ Freeze' },
  { id: 'shock', label: '⚡ Shock' },
  { id: 'poison', label: '☠️ Poison' },
  { id: 'lifesteal', label: '❤️ Lifesteal' },
  { id: 'critical', label: '💥 Critical' },
  { id: 'lucky', label: '🍀 Lucky' },
  { id: 'defense', label: '🛡️ Defense' },
  { id: 'blessing', label: '✨ Blessing' },
  { id: 'curse', label: '👁️ Curse' },
];
const SKINS = ['Dragon Skin', 'Galaxy Skin', 'Cyber Skin'];

const DEFAULT_PROGRESS = () => ({
  forged: false,
  level: 0,
  durability: 100,
  enchant: null,
  refine: 'normal',
  stage: 0, // evolution stage, index into EVOLUTION_PREFIXES
  ascension: 0, // 0-4 prestige tiers, flavor only (see note in ascend.js)
  socketedGem: null,
  locked: false,
  favorite: false,
  skin: null,
  masteryLevel: 1,
  masteryXp: 0,
});

/** Current forge progress for a user+item, backfilled with defaults. */
function getProgress(user, itemId) {
  return { ...DEFAULT_PROGRESS(), ...((user.forge && user.forge[itemId]) || {}) };
}

/** Merges a patch into a user's progress for one item and persists it. */
function saveProgress(userId, itemId, patch) {
  const user = getUser(userId);
  const current = getProgress(user, itemId);
  const updated = { ...current, ...patch };
  saveUser(userId, { forge: { ...(user.forge || {}), [itemId]: updated } });
  return updated;
}

/** Display-friendly name including level/refine/stage/skin flourishes. */
function progressDisplayName(item, progress) {
  const prefix = EVOLUTION_PREFIXES[progress.stage] ? `${EVOLUTION_PREFIXES[progress.stage]} ` : '';
  const refinePrefix = progress.refine !== 'normal' ? `[${progress.refine}] ` : '';
  const levelSuffix = progress.level > 0 ? ` +${progress.level}` : '';
  const skinSuffix = progress.skin ? ` (${progress.skin})` : '';
  return `${item.emoji} ${refinePrefix}${prefix}${item.name}${levelSuffix}${skinSuffix}`;
}

function requireOwned(user, item) {
  return item && user.inventory.includes(item.id);
}

module.exports = {
  MAX_LEVEL,
  LEVEL_SAFE_THRESHOLD,
  REFINE_TIERS,
  EVOLUTION_PREFIXES,
  ENCHANTS,
  SKINS,
  DEFAULT_PROGRESS,
  getProgress,
  saveProgress,
  progressDisplayName,
  requireOwned,
};
