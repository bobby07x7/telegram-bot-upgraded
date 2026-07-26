/**
 * src/core/menuContent.js
 * Builds /start and /help. Owner-only / admin-only commands and the
 * whole "owner" category are fully invisible to normal users —
 * not disabled, not "no permission": simply not present anywhere.
 */

const { buildKeyboard, withFooter, card, ICONS } = require('./uiHelper');

const CATEGORY_META = {
  user: { icon: ICONS.user, label: 'Profile & Stats' },
  economy: { icon: ICONS.economy, label: 'Economy' },
  gacha: { icon: ICONS.gacha, label: 'Gacha' },
  media: { icon: ICONS.media, label: 'Media' },
  group: { icon: ICONS.group, label: 'Group Tools' },
  security: { icon: ICONS.security, label: 'Security' },
  utility: { icon: ICONS.utility, label: 'Utility' },
  games: { icon: ICONS.games, label: 'Mini-Games' },
  fun: { icon: ICONS.fun, label: 'Fun' },
  owner: { icon: ICONS.owner, label: 'Owner Panel' },
};
const PRIVILEGED_CATEGORIES = new Set(['owner']);

function isPrivileged(userId, config) {
  const admins = config?.botAdmins || [];
  return String(userId) === String(config?.ownerId) || admins.map(String).includes(String(userId));
}

/** Returns { category: [commands...] }, already filtered for this user. */
function visibleCategories(commandLoader, userId, config) {
  const privileged = isPrivileged(userId, config);
  const byCategory = {};
  for (const cmd of commandLoader.all()) {
    const category = cmd.category || 'utility';
    const restricted = cmd.ownerOnly || cmd.adminOnly || PRIVILEGED_CATEGORIES.has(category);
    if (restricted && !privileged) continue;
    (byCategory[category] ||= []).push(cmd);
  }
  return byCategory;
}

function buildStartMenu({ config, userId, commandLoader }) {
  const privileged = isPrivileged(userId, config);
  const total = commandLoader.all().length;
  const visibleTotal = Object.values(visibleCategories(commandLoader, userId, config)).flat().length;

  const text = card({
    icon: ICONS.star,
    title: `Welcome to ${config.botName}`,
    lines: [
      `Economy, gacha, mini-games, moderation, media downloads — one clean menu.`,
      `\`${visibleTotal}\` commands ready to use.`,
      privileged ? `${ICONS.owner} Owner controls unlocked.` : null,
    ].filter(Boolean),
    footer: 'Tap a category to get started',
  });

  const rows = [
    [{ text: `${ICONS.economy} Economy`, callback_data: 'menu:cat:economy' },
     { text: `${ICONS.gacha} Gacha`, callback_data: 'menu:cat:gacha' }],
    [{ text: `${ICONS.games} Games`, callback_data: 'menu:cat:games' },
     { text: `${ICONS.fun} Fun`, callback_data: 'menu:cat:fun' }],
    [{ text: `${ICONS.group} Group`, callback_data: 'menu:cat:group' },
     { text: `${ICONS.security} Security`, callback_data: 'menu:cat:security' }],
    [{ text: `${ICONS.utility} Utility`, callback_data: 'menu:cat:utility' },
     { text: `${ICONS.media} Media`, callback_data: 'menu:cat:media' }],
    [{ text: `📖 Full Help`, callback_data: 'menu:help' }],
  ];
  if (privileged) rows.push([{ text: `${ICONS.owner} Owner Panel`, callback_data: 'menu:cat:owner' }]);
  rows.push([
    { text: '👥 Support', url: config.SUPPORT_GROUP_URL },
    { text: '➕ Add to Group', url: config.ADD_TO_GROUP_URL },
  ]);

  return { text, keyboard: buildKeyboard(rows) };
}

function buildCategoryMenu({ category, commandLoader, userId, config }) {
  const meta = CATEGORY_META[category] || { icon: ICONS.utility, label: category };
  const list = visibleCategories(commandLoader, userId, config)[category] || [];

  const text = card({
    icon: meta.icon,
    title: meta.label,
    lines: list.length
      ? list.map((c) => `• /${c.name} — ${c.description || 'No description'}`)
      : ['No commands available yet.'],
  });
  const keyboard = buildKeyboard(withFooter([], { back: 'menu:start' }));
  return { text, keyboard };
}

/** Flat /help text, category by category, still filtered. */
function buildHelpMenu({ commandLoader, userId, config }) {
  const grouped = visibleCategories(commandLoader, userId, config);
  const lines = [];
  for (const [category, cmds] of Object.entries(grouped)) {
    const meta = CATEGORY_META[category] || { icon: ICONS.utility, label: category };
    lines.push(`\n${meta.icon} *${meta.label}*`);
    cmds.forEach((c) => lines.push(`  /${c.name} — ${c.description || ''}`));
  }
  const text = card({ icon: ICONS.star, title: 'All Commands', lines });
  const keyboard = buildKeyboard(withFooter([], { back: 'menu:start' }));
  return { text, keyboard };
}

module.exports = {
  CATEGORY_META, isPrivileged, visibleCategories,
  buildStartMenu, buildCategoryMenu, buildHelpMenu,
};
