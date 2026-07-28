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
  mythic: { label: 'Mythic', emoji: '🔴', color: '#FF3A3A', weight: 0.7 },
  divine: { label: 'Divine', emoji: '⚫', color: '#1A1A1A', weight: 0.2 },
  celestial: { label: 'Celestial', emoji: '🌌', color: '#8A6BFF', weight: 0.08 },
  infinity: { label: 'Infinity', emoji: '♾️', color: '#FFFFFF', weight: 0.02 },
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

  // ── New shop items ──────────────────────────────────────
  hammer: { id: 'hammer', name: "Thunder Hammer", emoji: '🔨', slot: 'weapon', rarity: 'rare', price: 2800, source: 'shop' },
  helmet: { id: 'helmet', name: 'Knight Helmet', emoji: '🪖', slot: 'armor', rarity: 'uncommon', price: 1400, source: 'shop' },
  wings: { id: 'wings', name: 'Angel Wings', emoji: '🪽', slot: 'accessory', rarity: 'epic', price: 4200, source: 'shop' },

  // ── New gacha-only items ─────────────────────────────────
  starblade: { id: 'starblade', name: 'Starfall Blade', emoji: '🌠', slot: 'weapon', rarity: 'legendary', source: 'gacha' },
  voidarmor: { id: 'voidarmor', name: 'Void Reaver Armor', emoji: '🖤', slot: 'armor', rarity: 'epic', source: 'gacha' },
  moonstone: { id: 'moonstone', name: 'Moonstone Talisman', emoji: '🌙', slot: 'accessory', rarity: 'rare', source: 'gacha' },

  // ── Owner-exclusive items — never buyable or in the gacha pool.
  // Only obtainable via the owner-only /grant command (see commands/owner/grant.js).
  godcrown: { id: 'godcrown', name: 'Crown of the Bot God', emoji: '👑', slot: 'accessory', rarity: 'legendary', source: 'owner' },
  godblade: { id: 'godblade', name: 'Blade of Creation', emoji: '⚡', slot: 'weapon', rarity: 'legendary', source: 'owner' },
  godarmor: { id: 'godarmor', name: 'Armor of the Ancients', emoji: '🛡️✨', slot: 'armor', rarity: 'legendary', source: 'owner' },
  godhalo: { id: 'godhalo', name: 'Halo of Omniscience', emoji: '😇', slot: 'accessory', rarity: 'legendary', source: 'owner' },
  godthrone: { id: 'godthrone', name: 'Throne of the Bot God', emoji: '🪑👑', slot: null, rarity: 'legendary', source: 'owner' },

  // ── Wave 2: More shop items ───────────────────────────────
  dagger: { id: 'dagger', name: 'Assassin Dagger', emoji: '🔪', slot: 'weapon', rarity: 'common', price: 450, source: 'shop' },
  buckler: { id: 'buckler', name: 'Steel Buckler', emoji: '🥉', slot: 'armor', rarity: 'common', price: 400, source: 'shop' },
  bandage: { id: 'bandage', name: 'Bandage Kit', emoji: '🩹', slot: 'consumable', rarity: 'common', price: 80, source: 'shop' },
  necklace: { id: 'necklace', name: 'Jade Necklace', emoji: '📿', slot: 'accessory', rarity: 'uncommon', price: 1600, source: 'shop' },
  battleaxe: { id: 'battleaxe', name: 'War Battleaxe', emoji: '🪓', slot: 'weapon', rarity: 'epic', price: 3900, source: 'shop' },
  plateboots: { id: 'plateboots', name: 'Plate Greaves', emoji: '🥾', slot: 'armor', rarity: 'rare', price: 1900, source: 'shop' },
  elixir: { id: 'elixir', name: 'Greater Elixir', emoji: '🧉', slot: 'consumable', rarity: 'uncommon', price: 300, source: 'shop' },
  warbanner: { id: 'warbanner', name: 'War Banner', emoji: '🚩', slot: null, rarity: 'rare', price: 2500, source: 'shop' },

  // ── Wave 2: More gacha items across every rarity ──────────
  slingshot: { id: 'slingshot', name: 'Rusty Slingshot', emoji: '🪃', slot: 'weapon', rarity: 'common', source: 'gacha' },
  strawhat: { id: 'strawhat', name: 'Straw Hat', emoji: '👒', slot: 'armor', rarity: 'common', source: 'gacha' },
  candle: { id: 'candle', name: 'Wax Candle', emoji: '🕯️', slot: null, rarity: 'common', source: 'gacha' },
  frostblade: { id: 'frostblade', name: 'Frostbite Blade', emoji: '❄️', slot: 'weapon', rarity: 'rare', source: 'gacha' },
  emberplate: { id: 'emberplate', name: 'Ember Plate Armor', emoji: '🔥', slot: 'armor', rarity: 'rare', source: 'gacha' },
  windboots: { id: 'windboots', name: 'Windwalker Boots', emoji: '💨', slot: 'armor', rarity: 'uncommon', source: 'gacha' },
  runestone: { id: 'runestone', name: 'Ancient Runestone', emoji: '🪨', slot: null, rarity: 'uncommon', source: 'gacha' },
  shadowfang: { id: 'shadowfang', name: 'Shadowfang', emoji: '🦇', slot: 'weapon', rarity: 'epic', source: 'gacha' },
  celestialorb: { id: 'celestialorb', name: 'Celestial Orb', emoji: '🔮', slot: 'accessory', rarity: 'epic', source: 'gacha' },
  ancienttome: { id: 'ancienttome', name: 'Ancient Tome', emoji: '📖', slot: null, rarity: 'rare', source: 'gacha' },
  dragonegg: { id: 'dragonegg', name: 'Dragon Egg', emoji: '🥚', slot: null, rarity: 'epic', source: 'gacha' },
  worldbranch: { id: 'worldbranch', name: 'World Tree Branch', emoji: '🌿', slot: 'accessory', rarity: 'legendary', source: 'gacha' },
  chronowatch: { id: 'chronowatch', name: 'Chrono Pocketwatch', emoji: '⏱️', slot: 'accessory', rarity: 'legendary', source: 'gacha' },

  // ── Wave 3: More shop items ────────────────────────────────
  cutlass: { id: 'cutlass', name: 'Pirate Cutlass', emoji: '🗡️', slot: 'weapon', rarity: 'uncommon', price: 1100, source: 'shop' },
  spiritblade: { id: 'spiritblade', name: 'Spirit Blade', emoji: '👻', slot: 'weapon', rarity: 'legendary', price: 32000, source: 'shop' },
  obsidianplate: { id: 'obsidianplate', name: 'Obsidian Plate', emoji: '🖤', slot: 'armor', rarity: 'legendary', price: 30000, source: 'shop' },
  scarf: { id: 'scarf', name: 'Hero Scarf', emoji: '🧣', slot: 'accessory', rarity: 'common', price: 350, source: 'shop' },
  goggles: { id: 'goggles', name: 'Tactical Goggles', emoji: '🥽', slot: 'accessory', rarity: 'rare', price: 2600, source: 'shop' },
  antidote: { id: 'antidote', name: 'Antidote', emoji: '💊', slot: 'consumable', rarity: 'common', price: 120, source: 'shop' },
  staminadrink: { id: 'staminadrink', name: 'Stamina Drink', emoji: '🥤', slot: 'consumable', rarity: 'common', price: 90, source: 'shop' },
  megapotion: { id: 'megapotion', name: 'Mega Health Potion', emoji: '🍾', slot: 'consumable', rarity: 'rare', price: 900, source: 'shop' },
  firecracker: { id: 'firecracker', name: 'Firecracker Pack', emoji: '🧨', slot: null, rarity: 'uncommon', price: 700, source: 'shop' },
  trophy: { id: 'trophy', name: 'Golden Trophy', emoji: '🏆', slot: null, rarity: 'epic', price: 6000, source: 'shop' },
  medal: { id: 'medal', name: 'Honor Medal', emoji: '🎖️', slot: null, rarity: 'uncommon', price: 1000, source: 'shop' },

  // ── Wave 4: Nisha Grand Store — higher weapon/armor tiers ──
  steelsword: { id: 'steelsword', name: 'Steel Sword', emoji: '⚔️', slot: 'weapon', rarity: 'uncommon', price: 1500, source: 'shop' },
  shadowkatana: { id: 'shadowkatana', name: 'Shadow Katana', emoji: '🗡️', slot: 'weapon', rarity: 'epic', price: 9500, source: 'shop' },
  dragonslayer: { id: 'dragonslayer', name: 'Dragon Slayer', emoji: '⚔️', slot: 'weapon', rarity: 'legendary', price: 25000, source: 'shop' },
  celestialblade: { id: 'celestialblade', name: 'Celestial Blade', emoji: '🌌', slot: 'weapon', rarity: 'celestial', price: 60000, source: 'shop' },
  infinitysword: { id: 'infinitysword', name: 'Infinity Sword', emoji: '♾️', slot: 'weapon', rarity: 'infinity', price: 150000, source: 'shop' },

  leatherarmor: { id: 'leatherarmor', name: 'Leather Armor', emoji: '🥋', slot: 'armor', rarity: 'common', price: 800, source: 'shop' },
  knightarmor: { id: 'knightarmor', name: 'Knight Armor', emoji: '🛡️', slot: 'armor', rarity: 'uncommon', price: 3500, source: 'shop' },
  shadowarmor: { id: 'shadowarmor', name: 'Shadow Armor', emoji: '🖤', slot: 'armor', rarity: 'rare', price: 8000, source: 'shop' },
  dragonarmor: { id: 'dragonarmor', name: 'Dragon Armor', emoji: '🐲', slot: 'armor', rarity: 'epic', price: 18000, source: 'shop' },
  royalarmor: { id: 'royalarmor', name: 'Royal Armor', emoji: '👑', slot: 'armor', rarity: 'legendary', price: 40000, source: 'shop' },
  divinearmor: { id: 'divinearmor', name: 'Divine Armor', emoji: '⚫', slot: 'armor', rarity: 'divine', price: 90000, source: 'shop' },

  timewatch: { id: 'timewatch', name: 'Time Watch', emoji: '⌚', slot: 'accessory', rarity: 'epic', price: 12000, source: 'shop' },
  infinitystone: { id: 'infinitystone', name: 'Infinity Stone', emoji: '💎', slot: 'accessory', rarity: 'infinity', price: 80000, source: 'shop' },

  // ── Wave 4: Potions (consumables) ──────────────────────────
  manapotion: { id: 'manapotion', name: 'Mana Potion', emoji: '💙', slot: 'consumable', rarity: 'common', price: 150, source: 'shop' },
  speedpotion: { id: 'speedpotion', name: 'Speed Potion', emoji: '⚡', slot: 'consumable', rarity: 'uncommon', price: 800, source: 'shop' },
  ragepotion: { id: 'ragepotion', name: 'Rage Potion', emoji: '🔥', slot: 'consumable', rarity: 'uncommon', price: 1200, source: 'shop' },
  defensepotion: { id: 'defensepotion', name: 'Defense Potion', emoji: '🛡️', slot: 'consumable', rarity: 'uncommon', price: 1200, source: 'shop' },
  phoenixelixir: { id: 'phoenixelixir', name: 'Phoenix Elixir', emoji: '✨', slot: 'consumable', rarity: 'legendary', price: 15000, source: 'shop' },

  // ── Wave 4: Gems (new equippable 'gem' slot) ───────────────
  gemruby: { id: 'gemruby', name: 'Ruby', emoji: '❤️', slot: 'gem', rarity: 'rare', price: 2500, source: 'shop' },
  gememerald: { id: 'gememerald', name: 'Emerald', emoji: '💚', slot: 'gem', rarity: 'rare', price: 3000, source: 'shop' },
  gemsapphire: { id: 'gemsapphire', name: 'Sapphire', emoji: '💙', slot: 'gem', rarity: 'rare', price: 3000, source: 'shop' },
  gemobsidian: { id: 'gemobsidian', name: 'Obsidian Gem', emoji: '🖤', slot: 'gem', rarity: 'epic', price: 4000, source: 'shop' },
  gemdiamond: { id: 'gemdiamond', name: 'Diamond', emoji: '🤍', slot: 'gem', rarity: 'epic', price: 8500, source: 'shop' },
  gemcelestial: { id: 'gemcelestial', name: 'Celestial Gem', emoji: '🌈', slot: 'gem', rarity: 'celestial', price: 30000, source: 'shop' },

  // ── Wave 4: Artifacts (equippable accessories) ─────────────
  eyeofodin: { id: 'eyeofodin', name: 'Eye of Odin', emoji: '👁️', slot: 'accessory', rarity: 'legendary', price: 45000, source: 'shop' },
  dragonheart: { id: 'dragonheart', name: 'Dragon Heart', emoji: '❤️‍🔥', slot: 'accessory', rarity: 'legendary', price: 55000, source: 'shop' },
  stormcore: { id: 'stormcore', name: 'Storm Core', emoji: '⚡', slot: 'accessory', rarity: 'legendary', price: 65000, source: 'shop' },
  worldtreeseed: { id: 'worldtreeseed', name: 'World Tree Seed', emoji: '🌳', slot: 'accessory', rarity: 'legendary', price: 75000, source: 'shop' },
  infinitygauntlet: { id: 'infinitygauntlet', name: 'Infinity Gauntlet', emoji: '🧤', slot: 'accessory', rarity: 'infinity', price: 200000, source: 'shop' },

  // ── Wave 4: Wings (new equippable 'wing' slot) ─────────────
  demonwings: { id: 'demonwings', name: 'Demon Wings', emoji: '😈', slot: 'wing', rarity: 'epic', price: 18000, source: 'shop' },
  crystalwings: { id: 'crystalwings', name: 'Crystal Wings', emoji: '💎', slot: 'wing', rarity: 'epic', price: 22000, source: 'shop' },
  galaxywings: { id: 'galaxywings', name: 'Galaxy Wings', emoji: '🌌', slot: 'wing', rarity: 'legendary', price: 40000, source: 'shop' },
  voidwings: { id: 'voidwings', name: 'Void Wings', emoji: '♾️', slot: 'wing', rarity: 'celestial', price: 70000, source: 'shop' },

  // ── Wave 4: Pets (new equippable 'pet' slot) ───────────────
  petwolf: { id: 'petwolf', name: 'Wolf', emoji: '🐺', slot: 'pet', rarity: 'uncommon', price: 5000, source: 'shop' },
  petfox: { id: 'petfox', name: 'Fox', emoji: '🦊', slot: 'pet', rarity: 'rare', price: 7500, source: 'shop' },
  pettiger: { id: 'pettiger', name: 'Tiger', emoji: '🐯', slot: 'pet', rarity: 'rare', price: 12000, source: 'shop' },
  petunicorn: { id: 'petunicorn', name: 'Unicorn', emoji: '🦄', slot: 'pet', rarity: 'legendary', price: 40000, source: 'shop' },
  petdragon: { id: 'petdragon', name: 'Dragon', emoji: '🐉', slot: 'pet', rarity: 'legendary', price: 85000, source: 'shop' },
  petguardianangel: { id: 'petguardianangel', name: 'Guardian Angel', emoji: '👼', slot: 'pet', rarity: 'mythic', price: 150000, source: 'shop' },

  // ── Wave 4: Summons (new equippable 'summon' slot) ─────────
  summonskeletonking: { id: 'summonskeletonking', name: 'Skeleton King', emoji: '💀', slot: 'summon', rarity: 'epic', price: 18000, source: 'shop' },
  summonicegolem: { id: 'summonicegolem', name: 'Ice Golem', emoji: '🧊', slot: 'summon', rarity: 'epic', price: 25000, source: 'shop' },
  summondemonlord: { id: 'summondemonlord', name: 'Demon Lord', emoji: '😈', slot: 'summon', rarity: 'legendary', price: 60000, source: 'shop' },
  summonphoenix: { id: 'summonphoenix', name: 'Phoenix', emoji: '🔥', slot: 'summon', rarity: 'mythic', price: 100000, source: 'shop' },
  summonleviathan: { id: 'summonleviathan', name: 'Leviathan', emoji: '🌊', slot: 'summon', rarity: 'divine', price: 180000, source: 'shop' },

  // ── Wave 4: Mounts (new equippable 'mount' slot) ───────────
  mounthorse: { id: 'mounthorse', name: 'Horse', emoji: '🐎', slot: 'mount', rarity: 'uncommon', price: 4000, source: 'shop' },
  mountdirewolf: { id: 'mountdirewolf', name: 'Dire Wolf', emoji: '🐺', slot: 'mount', rarity: 'rare', price: 12000, source: 'shop' },
  mountgriffin: { id: 'mountgriffin', name: 'Griffin', emoji: '🦅', slot: 'mount', rarity: 'legendary', price: 45000, source: 'shop' },
  mountdragon: { id: 'mountdragon', name: 'Dragon Mount', emoji: '🐉', slot: 'mount', rarity: 'mythic', price: 120000, source: 'shop' },

  // ── Wave 4: Cosmetics (null slot, display/collectible only) ─
  heroskin: { id: 'heroskin', name: 'Hero Skin', emoji: '🎨', slot: null, rarity: 'epic', price: 3000, source: 'shop' },
  weaponskin: { id: 'weaponskin', name: 'Weapon Skin', emoji: '⚔️', slot: null, rarity: 'rare', price: 2500, source: 'shop' },
  animatedframe: { id: 'animatedframe', name: 'Animated Frame', emoji: '🖼️', slot: null, rarity: 'epic', price: 5000, source: 'shop' },
  nameeffect: { id: 'nameeffect', name: 'Name Effect', emoji: '🌈', slot: null, rarity: 'epic', price: 8000, source: 'shop' },
  auraeffect: { id: 'auraeffect', name: 'Aura Effect', emoji: '✨', slot: null, rarity: 'legendary', price: 10000, source: 'shop' },
  killeffect: { id: 'killeffect', name: 'Kill Effect', emoji: '💀', slot: null, rarity: 'legendary', price: 15000, source: 'shop' },

  // ── Wave 4: Special (null slot, collectible passes/tickets) ─
  battlepass: { id: 'battlepass', name: 'Battle Pass', emoji: '🎫', slot: null, rarity: 'epic', price: 50000, source: 'shop' },
  vippass: { id: 'vippass', name: 'VIP Pass', emoji: '👑', slot: null, rarity: 'legendary', price: 100000, source: 'shop' },
  mysterybox: { id: 'mysterybox', name: 'Mystery Box', emoji: '🎁', slot: null, rarity: 'rare', price: 2500, source: 'shop' },
  luckyticket: { id: 'luckyticket', name: 'Lucky Ticket', emoji: '🎲', slot: null, rarity: 'uncommon', price: 500, source: 'shop' },

  // ── Wave 5: Forge system materials ──────────────────────────
  awakeningstone: { id: 'awakeningstone', name: 'Awakening Stone', emoji: '🪄', slot: null, rarity: 'legendary', price: 20000, source: 'shop' },
  craftmaterial: { id: 'craftmaterial', name: 'Craft Materials', emoji: '⚒️', slot: null, rarity: 'common', price: 300, source: 'shop' },
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
