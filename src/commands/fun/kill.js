const { playEliminationCinematic } = require('../../core/uiHelper');

const KILL_LINES = [
  'was launched into the sun. ☀️',
  'got sucked into a black hole. 🕳️',
  'was defeated with a rubber chicken. 🐔',
  'got sniped from across the map. 🎯',
  'was banished to the shadow realm. 🌑',
  'exploded into a cloud of confetti. 🎉',
  'slipped on a banana peel into oblivion. 🍌',
  'was vaporized by a laser pointer. 🔦',
  'got dropkicked off a cliff by a penguin. 🐧',
];

const SUSPENSE_FRAMES = [
  'Locating target... 🎯',
  'Loading weapon... 🔫',
  'Taking aim... 👁️',
  'Firing in 3... 2... 1...',
];

module.exports = {
  name: 'kill',
  description: 'Playfully "eliminate" someone (reply to their message) — all in good fun',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;

    if (!target) return ctx.reply('↩️ Reply to the user you want to "kill".\nUsage: /kill (as a reply)');
    if (target.id === ctx.from.id) return ctx.reply('❌ You cannot target yourself... unless you really want to.');
    if (target.is_bot) return ctx.reply("🤖 I'm immortal, try someone else.");

    const line = KILL_LINES[Math.floor(Math.random() * KILL_LINES.length)];
    const resultText = `☠️ *ELIMINATED!*\n\n💀 ${target.first_name} ${line}\n\n_Rest in pixels._ 🕊️`;

    await playEliminationCinematic(ctx, {
      introLabel: `🔫 ${ctx.from.first_name} → ${target.first_name}`,
      suspenseFrames: SUSPENSE_FRAMES,
      resultText,
      extra: { parse_mode: 'Markdown' },
    });
  },
};
