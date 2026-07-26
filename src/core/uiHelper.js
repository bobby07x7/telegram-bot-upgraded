/**
 * src/core/uiHelper.js
 * ---------------------------------------------------------------
 * Central UI layer for the bot: inline keyboards, loading/progress
 * animations, and reusable "card" style message formatting.
 *
 * Every command should build its reply through the helpers here so
 * the whole bot (209 commands) looks and feels consistent, instead
 * of each command hand-rolling its own markdown/buttons.
 *
 * Drop-in replacement for src/core/uiHelper.js — no other file
 * needs to change to start using it (commands opt-in gradually).
 * ---------------------------------------------------------------
 */

const { Markup } = require('telegraf');

// ---------------------------------------------------------------
// Theme — change these two objects and the whole bot re-skins.
// ---------------------------------------------------------------
const THEME = {
  brand: '『 𝗕𝗢𝗧 』',
  bar: {
    full: '█',
    empty: '░',
    length: 12,
  },
  divider: '┈'.repeat(24),
};

const ICONS = {
  economy: '💰', gacha: '🎰', media: '🎬', group: '🛡️', security: '🔐',
  utility: '🛠️', games: '🎮', fun: '🎉', user: '👤', owner: '👑',
  back: '◀️', close: '✖️', next: '▶️', refresh: '🔄', loading: '⏳',
  success: '✅', fail: '❌', warn: '⚠️', star: '✨', fire: '🔥',
};

// =================================================================
// KEYBOARD BUILDERS
// =================================================================

/**
 * rows: [[{text, callback_data} | {text, url}], ...]
 * Accepts plain button objects — url buttons pass through, callback
 * buttons pass through — so existing action handlers keep working.
 */
function buildKeyboard(rows = []) {
  const mapped = rows.map((row) =>
    row.map((btn) =>
      btn.url
        ? Markup.button.url(btn.text, btn.url)
        : Markup.button.callback(btn.text, btn.callback_data)
    )
  );
  return Markup.inlineKeyboard(mapped);
}

/** Standard back/close footer row, appended by convention. */
function withFooter(rows, { back, close = true } = {}) {
  const footer = [];
  if (back) footer.push({ text: `${ICONS.back} Back`, callback_data: back });
  if (close) footer.push({ text: `${ICONS.close} Close`, callback_data: 'ui:close' });
  return footer.length ? [...rows, footer] : rows;
}

/** Simple pager for long lists (help pages, shop pages, leaderboards). */
function paginate(items, page, perPage, callbackPrefix) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const p = Math.min(Math.max(1, page), totalPages);
  const slice = items.slice((p - 1) * perPage, p * perPage);
  const nav = [];
  if (p > 1) nav.push({ text: '◀️', callback_data: `${callbackPrefix}:${p - 1}` });
  nav.push({ text: `${p}/${totalPages}`, callback_data: 'ui:noop' });
  if (p < totalPages) nav.push({ text: '▶️', callback_data: `${callbackPrefix}:${p + 1}` });
  return { slice, page: p, totalPages, nav };
}

// =================================================================
// STYLED TEXT
// =================================================================

/** Card-style block: title, body lines, optional footer note. */
function card({ icon = ICONS.star, title, lines = [], footer }) {
  const parts = [
    `${icon} *${escapeMd(title)}*`,
    THEME.divider,
    ...lines,
  ];
  if (footer) parts.push(THEME.divider, `_${escapeMd(footer)}_`);
  return parts.join('\n');
}

function progressBar(percent) {
  const filled = Math.round((THEME.bar.length * percent) / 100);
  return THEME.bar.full.repeat(filled) + THEME.bar.empty.repeat(THEME.bar.length - filled);
}

function escapeMd(str = '') {
  return String(str).replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
}

// =================================================================
// ANIMATIONS
// =================================================================

/**
 * Generic frame-by-frame animation over an existing sent message.
 * frames: array of strings (or {text, delay} objects).
 * Returns the final Message object so the caller can attach a
 * keyboard / continue editing afterwards.
 */
async function playAnimation(ctx, sentMsg, frames, { parse_mode = 'Markdown' } = {}) {
  for (const frame of frames) {
    const text = typeof frame === 'string' ? frame : frame.text;
    const delay = typeof frame === 'string' ? 550 : frame.delay ?? 550;
    await sleep(delay);
    try {
      await ctx.telegram.editMessageText(
        sentMsg.chat.id,
        sentMsg.message_id,
        undefined,
        text,
        { parse_mode }
      );
    } catch (_) { /* ignore identical-content edit errors */ }
  }
  return sentMsg;
}

/** Quick loading spinner for any command — call at the top, then edit with the real result. */
async function loading(ctx, label = 'Working') {
  const frames = ['⏳', '⌛', '⏳', '⌛'];
  const msg = await ctx.reply(`${frames[0]} ${label}...`);
  for (let i = 1; i < frames.length; i++) {
    await sleep(300);
    try {
      await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, `${frames[i]} ${label}...`);
    } catch (_) {}
  }
  return msg; // caller does the final editMessageText with real content
}

/**
 * Ping-style animation: shows a progress bar filling up, then the
 * final latency card. Used by /ping and reusable anywhere a command
 * wants a "measuring..." beat before revealing a number.
 */
async function pingAnimation(ctx, computeFn) {
  const start = Date.now();
  const msg = await ctx.reply(`${ICONS.loading} Pinging...\n${progressBar(0)}`);
  const steps = [20, 45, 70, 90, 100];
  for (const pct of steps) {
    await sleep(180);
    try {
      await ctx.telegram.editMessageText(
        msg.chat.id, msg.message_id, undefined,
        `${ICONS.loading} Pinging...\n${progressBar(pct)}  ${pct}%`
      );
    } catch (_) {}
  }
  const result = await computeFn?.();
  const ms = Date.now() - start;
  const final = card({
    icon: ICONS.fire,
    title: 'Pong!',
    lines: [
      `Latency: \`${ms}ms\``,
      result?.apiMs ? `API: \`${result.apiMs}ms\`` : null,
      `Status: ${ICONS.success} Online`,
    ].filter(Boolean),
  });
  await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, final, { parse_mode: 'Markdown' });
  return msg;
}

/**
 * "Fight" animation for games/fun commands (e.g. /fight, /duel, /kill).
 * attacker/defender: display names. Renders a short exchange, then a
 * winner card. Pure text/emoji — no external assets needed.
 */
async function fightAnimation(ctx, { attacker, defender, winner, moves }) {
  const defaultMoves = [
    `${ICONS.fire} ${attacker} charges at ${defender}!`,
    `💥 ${attacker} lands a hit!`,
    `🛡️ ${defender} blocks and counters!`,
    `⚔️ Both trade blows...`,
  ];
  const seq = moves?.length ? moves : defaultMoves;
  const msg = await ctx.reply(`${ICONS.loading} A fight is starting...`);
  for (const line of seq) {
    await sleep(500);
    try {
      await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, line);
    } catch (_) {}
  }
  await sleep(500);
  const final = card({
    icon: '🏆',
    title: `${winner} wins!`,
    lines: [`${attacker} vs ${defender}`, `Winner: *${escapeMd(winner)}*`],
  });
  await ctx.telegram.editMessageText(msg.chat.id, msg.message_id, undefined, final, { parse_mode: 'Markdown' });
  return msg;
}

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

module.exports = {
  THEME, ICONS,
  buildKeyboard, withFooter, paginate,
  card, progressBar, escapeMd,
  playAnimation, loading, pingAnimation, fightAnimation,
  sleep,
};
