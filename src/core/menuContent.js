const { config } = require('../config/config');

// Category key -> display label. To add a new category, just add it here.
const CATEGORY_LABELS = {
  user: '👤 User',
  economy: '💰 Economy',
  gacha: '🎲 Gacha',
  media: '🎵 Media',
  group: '👥 Group',
  security: '🛡 Security',
  utility: '🌐 Utility',
  games: '🎮 Games',
  fun: '😂 Fun',
  owner: '👑 Owner',
};

// Rotates on every /start so returning users keep discovering things,
// and brand-new users always get one concrete next action to try.
const START_TIPS = [
  '💡 Try /spin for a free daily gacha pull.',
  '💡 Reply to a friend with /fight for a live PvP brawl.',
  '💡 Use /daily to claim free coins every 24h.',
  '💡 Check /profile to see your level, XP and stats.',
  '💡 Explore /help to browse all 200+ commands by category.',
  '💡 Try /slots or /rps to test your luck with coins.',
];

function pickTip() {
  return START_TIPS[Math.floor(Math.random() * START_TIPS.length)];
}

function buildStartText(ctx, commands, viewer = { isGroup: true, isOwner: false }) {
  const name = escapeMd(ctx.from?.first_name || 'User');
  const uptime = formatUptime(process.uptime());
  const botName = escapeMd(config.bot_meta.name || 'Bot');

  // If a commands map is passed, list categories that actually have
  // commands; otherwise fall back to a static feature list.
  const featureLines = commands
    ? getAvailableCategories(commands, viewer).map(({ label }) => `║ • ${label}`)
    : [
        '║ • AI Assistant',
        '║ • Economy',
        '║ • Gacha',
        '║ • Games',
        '║ • Group Manager',
        '║ • Media Downloader',
        '║ • Utility Tools',
      ];

  return `
╔══════════════════════════════╗
║${centerText(botName, 32)}    ║
╚══════════════════════════════╝
👋 Hello ${name}
I'm your All-in-One AI Assistant.
╔═════〔 🤖 BOT INFO 〕═════╗
║ 👤 User      : ${name}
║ 🤖 Version   : ${config.bot_meta.version || '1.0.0'}
║ ⚡ Runtime   : ${uptime}
║ 🟢 Node.js   : ${process.version}
║ 🌍 Platform  : ${process.platform}
║
║ 🎯 Features
${featureLines.join('\n')}
╚══════════════════════════════╝
✨ Select a category below to continue.

${pickTip()}
`;
}

// Pads text with spaces on both sides to center it within a fixed-width
// box border (used for the bot name banner).
function centerText(text, width) {
  const len = text.length;
  if (len >= width) return text.slice(0, width);
  const totalPad = width - len;
  const left = Math.floor(totalPad / 2);
  const right = totalPad - left;
  return ' '.repeat(left) + text + ' '.repeat(right);
}

/**
 * Derives the list of categories that actually have at least one command,
 * based on the loaded commands map.
 *
 * BUG FIX: the "👑 Owner" category (and any owner-only commands) must never
 * be shown inside a group — even to the owner — and in a private chat it
 * should only be shown to the owner/admin themself. `viewer` carries that
 * context: { isGroup, isOwner }. When omitted, defaults to the old (unsafe)
 * behavior is NOT used — we default to "hide" for safety.
 */
function getAvailableCategories(commands, viewer = { isGroup: true, isOwner: false }) {
  const present = new Set();
  for (const cmd of commands.values()) {
    if (!cmd.category) continue;
    if (cmd.category === 'owner' || cmd.ownerOnly) {
      // Owner stuff: never in a group, and only for the owner/admin in DM.
      if (viewer.isGroup || !viewer.isOwner) continue;
    }
    present.add(cmd.category);
  }
  return Object.entries(CATEGORY_LABELS)
    .filter(([key]) => present.has(key))
    .map(([key, label]) => ({ key, label }));
}

function buildCategoryText(categoryKey, commands, viewer = { isGroup: true, isOwner: false }) {
  const label = CATEGORY_LABELS[categoryKey] || categoryKey;
  const hideOwnerStuff = categoryKey === 'owner' && (viewer.isGroup || !viewer.isOwner);

  const matched = hideOwnerStuff
    ? []
    : [...commands.values()].filter(
        (c) => c.category === categoryKey && (!c.ownerOnly || viewer.isOwner)
      );

  const lines = [`╔════⪼「 ${toBoldSans(label.replace(/^\S+\s/, ''))} 」`];

  if (hideOwnerStuff) {
    lines.push(`║ 🚫 This section is private and only available to the bot owner in DM.`);
  } else if (matched.length === 0) {
    lines.push(`║ _No commands in this category yet._`);
  } else {
    for (const cmd of matched) {
      lines.push(`║ ${smallCaps('use')} /${cmd.name}`);
      lines.push(`║ ${smallCaps(cmd.description || 'no description')}`);
      lines.push(`║`);
    }
    lines.pop(); // drop trailing blank line before the footer
  }

  lines.push(`╚════════════════════⪼`);

  return lines.join('\n');
}

function buildHelpOverviewText() {
  return (
    `╔════⪼「 ${toBoldSans('HELP MENU')} 」\n` +
    `║ Choose a category below\n` +
    `║ to see its commands 👇\n` +
    `╚════════════════════⪼`
  );
}

function formatUptime(seconds) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor((seconds / 3600) % 24);
  const d = Math.floor(seconds / 86400);
  return `${d}d ${h}h ${m}m ${s}s`;
}

function escapeMd(text) {
  return String(text).replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

// Converts plain ASCII letters/digits to Mathematical Sans-Bold unicode
// (used for the "𝗜𝗱 :", "𝗡𝗮𝗺𝗲 :" style labels).
function toBoldSans(str) {
  return String(str).replace(/[A-Za-z0-9]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(0x1d5d4 + (code - 65)); // A-Z
    if (code >= 97 && code <= 122) return String.fromCodePoint(0x1d5ee + (code - 97)); // a-z
    if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ec + (code - 48)); // 0-9
    return c;
  });
}

// Converts plain lowercase text to small-caps unicode
// (used for the event/body text, e.g. "ᴋᴇᴛɪᴋ /gacha ᴜɴᴛᴜᴋ ɢᴀᴄʜᴀ.").
const SMALL_CAPS_MAP = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ',
  i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
  q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
  y: 'ʏ', z: 'ᴢ',
};

function smallCaps(str) {
  return String(str)
    .toLowerCase()
    .replace(/[a-z]/g, (c) => SMALL_CAPS_MAP[c] || c);
}

module.exports = {
  CATEGORY_LABELS,
  buildStartText,
  getAvailableCategories,
  buildCategoryText,
  buildHelpOverviewText,
};