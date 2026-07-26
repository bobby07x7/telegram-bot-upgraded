const { Markup } = require('telegraf');
const { config } = require('../config/config');

/**
 * Shows a cycling loading animation, then replaces it with the final message.
 * Reusable everywhere — any command gets a polished loading effect in one line.
 *
 * @param {*} ctx Telegraf context
 * @param {string} finalText the message to show once loading finishes
 * @param {object} extra Telegraf extra options (reply_markup, parse_mode, etc.)
 * @param {string[]} frames loading frame texts (default: dots animation)
 * @param {number} frameDelayMs delay between each frame
 */
async function withLoadingAnimation(ctx, finalText, extra = {}, frames = null, frameDelayMs = 350) {
  const defaultFrames = ['⏳ Loading', '⏳ Loading.', '⏳ Loading..', '⏳ Loading...'];
  const seq = frames || defaultFrames;

  const sent = await ctx.reply(seq[0]);

  for (let i = 1; i < seq.length; i++) {
    await sleep(frameDelayMs);
    try {
      await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, seq[i]);
    } catch (_) {
      // if the edit fails (rate limit etc.), just continue to the next frame
    }
  }

  await sleep(frameDelayMs);
  await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, finalText, extra);
  return sent;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Emoji reel used purely for the spinning visual — the *real* result is
// decided beforehand by the gacha engine and only revealed on the final frame.
const REEL_SYMBOLS = ['⚪', '🟢', '🔵', '🟣', '🟡', '💠', '✨', '❔'];

function randomReel(n = 3) {
  return Array.from({ length: n }, () => REEL_SYMBOLS[Math.floor(Math.random() * REEL_SYMBOLS.length)]).join(' | ');
}

/**
 * Casino-style slot machine / suspense animation. Spins a reel that
 * decelerates into place, then reveals the real result card. The reel
 * content itself is cosmetic only — the actual outcome is already decided
 * before this runs and is only revealed on the final frame.
 *
 * @param {*} ctx Telegraf context
 * @param {string} resultText final message (item card, win/loss, etc.)
 * @param {object} extra reply_markup / parse_mode for the final message
 * @param {string} headerLabel label shown above the spinning reels (e.g. "🎰 SPIN")
 * @param {Function} reelFn optional () => string generator for each spin frame (default: 3-slot emoji reel)
 * @param {string} subLabel text shown under the reel while spinning
 */
async function playCasinoSpin(
  ctx,
  resultText,
  extra = {},
  headerLabel = '🎰 SPINNING',
  reelFn = randomReel,
  subLabel = 'Rolling the reels...'
) {
  const frame = (reel) =>
    `╔═══════ ${headerLabel} ═══════╗\n` +
    `║\n` +
    `║      [ ${reel} ]\n` +
    `║\n` +
    `║  ${subLabel}\n` +
    `╚══════════════════════════╝`;

  const sent = await ctx.reply(frame(reelFn()));

  // Decelerating spin: fast at first, then slows down like a real machine.
  const delays = [140, 160, 200, 260, 340, 440];
  for (const delay of delays) {
    await sleep(delay);
    try {
      await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, frame(reelFn()));
    } catch (_) {
      // rate limit / identical content — ignore and keep spinning
    }
  }

  await sleep(300);
  try {
    await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, resultText, extra);
  } catch (_) {
    await ctx.reply(resultText, extra);
  }
  return sent;
}

/**
 * Renders a simple text progress bar, e.g. [▰▰▰▰▰▱▱▱▱▱] 50%
 */
function buildProgressBar(current, max, length = 10) {
  const pct = max > 0 ? Math.min(1, current / max) : 0;
  const filled = Math.round(pct * length);
  return `[${'▰'.repeat(filled)}${'▱'.repeat(length - filled)}] ${Math.floor(pct * 100)}%`;
}

/**
 * Shared HP bar renderer — one definition used everywhere (fight, duel,
 * heal, profile, etc.) so combat visuals stay visually consistent.
 * Color shifts green -> yellow -> red as HP drops, for at-a-glance state.
 */
function buildHpBar(hp, max, length = 10) {
  const safeMax = max > 0 ? max : 1;
  const pct = Math.max(0, Math.min(1, hp / safeMax));
  const filled = Math.round(pct * length);
  const block = pct > 0.5 ? '🟩' : pct > 0.2 ? '🟨' : '🟥';
  return `${block.repeat(filled)}${'⬛'.repeat(length - filled)} ${Math.max(0, hp)}/${max}`;
}

/**
 * Sends Telegram's native "typing..." indicator. Fire-and-forget; failures
 * (e.g. restricted chat) are swallowed since this is purely cosmetic.
 */
async function showTyping(ctx) {
  try {
    await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  } catch (_) {
    // ignore — cosmetic only
  }
}

// Punchy onomatopoeia shown during combat clash frames — purely cosmetic.
const HIT_FX = ['💥', '⚡', '💢', '🔥', '✨'];
function randomHitFx() {
  return HIT_FX[Math.floor(Math.random() * HIT_FX.length)];
}

/**
 * Cinematic multi-stage combat animation shared by /fight, /duel, /kill and
 * any future PvP command. Plays: intro (VS card) -> N clash frames (each
 * revealing one log line, with a live HP snapshot if hp/maxHp are given) ->
 * final result card.
 *
 * The actual outcome/log must already be fully decided before this runs —
 * this function only *reveals* it frame by frame, it never decides who wins.
 *
 * @param {*} ctx Telegraf context
 * @param {object} opts
 *   fighterA / fighterB: { name, hp, maxHp } — hp/maxHp optional (omit for non-HP duels)
 *   logLines: string[] — one line revealed per clash frame
 *   introLabel: string — e.g. '🥊 FIGHT'
 *   resultText: string — final message (already fully built)
 *   extra: object — parse_mode / reply_markup for the final message
 *   frameDelayMs: number — delay between clash frames
 *   liveHp: { a: number[], b: number[] } — optional per-frame HP snapshots (same length as logLines)
 */
async function playCombatAnimation(ctx, opts) {
  const {
    fighterA,
    fighterB,
    logLines = [],
    introLabel = '⚔️ BATTLE',
    resultText,
    extra = {},
    frameDelayMs = 850,
    liveHp = null,
  } = opts;

  const hasHp = typeof fighterA.hp === 'number' && typeof fighterB.hp === 'number';

  const introText =
    `╔═══ ${introLabel} ═══╗\n` +
    `║\n` +
    `║  ${fighterA.name}\n` +
    `║       ⚔️  VS  🛡️\n` +
    `║  ${fighterB.name}\n` +
    `║\n` +
    `║  Get ready...\n` +
    `╚════════════════════╝`;

  const sent = await ctx.reply(introText);
  await sleep(700);

  // Reveal the fight round by round, always showing the last few lines
  // plus a live-updating HP snapshot so it reads like a real-time brawl.
  const shown = [];
  for (let i = 0; i < logLines.length; i++) {
    shown.push(`${randomHitFx()} ${logLines[i]}`);
    const visible = shown.slice(-5).join('\n');
    const hpA = hasHp ? (liveHp ? liveHp.a[i] : fighterA.hp) : null;
    const hpB = hasHp ? (liveHp ? liveHp.b[i] : fighterB.hp) : null;
    const frame =
      `${introLabel}\n\n` +
      (hasHp
        ? `${fighterA.name}\n${buildHpBar(hpA, fighterA.maxHp)}\n${fighterB.name}\n${buildHpBar(hpB, fighterB.maxHp)}\n\n`
        : '') +
      visible;
    try {
      await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, frame);
    } catch (_) {
      // ignore edit hiccups (rate limit / identical content)
    }
    await sleep(frameDelayMs);
  }

  await sleep(300);
  try {
    await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, resultText, extra);
  } catch (_) {
    await ctx.reply(resultText, extra);
  }
  return sent;
}

/**
 * Lightweight "elimination cinematic" for joke/fun PvP commands (/kill,
 * /roast-offs, etc.) that don't have real HP — just a few suspense frames
 * building to a punchline reveal.
 */
async function playEliminationCinematic(ctx, { introLabel = '💀 ELIMINATION', suspenseFrames = [], resultText, extra = {} }) {
  const sent = await ctx.reply(`╔═══ ${introLabel} ═══╗\n║\n║  ${suspenseFrames[0] || 'Loading target...'}\n║\n╚═══════════════════╝`);
  for (let i = 1; i < suspenseFrames.length; i++) {
    await sleep(500);
    try {
      await ctx.telegram.editMessageText(
        sent.chat.id,
        sent.message_id,
        undefined,
        `╔═══ ${introLabel} ═══╗\n║\n║  ${suspenseFrames[i]}\n║\n╚═══════════════════╝`
      );
    } catch (_) {
      // ignore
    }
  }
  await sleep(500);
  try {
    await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, resultText, extra);
  } catch (_) {
    await ctx.reply(resultText, extra);
  }
  return sent;
}

/**
 * The standard inline keyboard shown on /start.
 * If addToGroupUrl is empty, an "add to group" link is auto-generated from the bot's username.
 * The support/developer/add-to-group links only make sense in a DM — inside
 * a group they're just clutter (and "Add to Group" is actively confusing
 * when you're already in one), so they're hidden there.
 */
function buildStartKeyboard(botUsername, isGroup = false) {
  const addUrl =
    config.links.addToGroupUrl ||
    (botUsername ? `https://t.me/${botUsername}?startgroup=true` : 'https://t.me/');

  const rows = [
    [Markup.button.callback('📖 Help', 'menu:help'), Markup.button.callback('👤 Profile', 'menu:profile')],
    [
      Markup.button.callback('👛 Wallet', 'menu:wallet'),
      Markup.button.callback('🎒 Inventory', 'menu:inventory'),
      Markup.button.callback('🛒 Store', 'menu:store'),
    ],
    [Markup.button.callback('🎰 Spin', 'menu:spin')],
  ];

  if (!isGroup) {
    rows.push([
      Markup.button.url('💬 Support Group', config.links.supportGroup),
      Markup.button.url('📢 Support Channel', config.links.supportChannel),
    ]);
    rows.push([Markup.button.url('👨‍💻 Developer', config.links.developer)]);
    rows.push([Markup.button.url('➕ Add to Group', addUrl)]);
  }

  rows.push([Markup.button.callback('✖️ Close', 'menu:close')]);

  return Markup.inlineKeyboard(rows);
}

/**
 * Keyboard for a category page: category buttons + Back + Close.
 * categories = [{ key: 'utility', label: '⚙️ Utility' }, ...]
 */
function buildCategoryKeyboard(categories, activeKey) {
  const rows = [];
  for (let i = 0; i < categories.length; i += 2) {
    const row = categories.slice(i, i + 2).map((c) =>
      Markup.button.callback(
        c.key === activeKey ? `• ${c.label} •` : c.label,
        `help:${c.key}`
      )
    );
    rows.push(row);
  }
  rows.push([
    Markup.button.callback(' Back', 'menu:start'),
    Markup.button.callback(' Close', 'menu:close'),
  ]);
  return Markup.inlineKeyboard(rows);
}

module.exports = {
  withLoadingAnimation,
  playCasinoSpin,
  buildProgressBar,
  buildHpBar,
  showTyping,
  playCombatAnimation,
  playEliminationCinematic,
  sleep,
  buildStartKeyboard,
  buildCategoryKeyboard,
};
