const { Markup } = require('telegraf');
const sessions = require('../../core/memorySessions');
const EMOJIS = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒'];

function newBoard() {
  const pairs = [...EMOJIS, ...EMOJIS];
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs.map((emoji) => ({ emoji, revealed: false, matched: false }));
}

function renderBoard(board, chatId) {
  const buttons = board.map((cell, i) =>
    Markup.button.callback(cell.matched || cell.revealed ? cell.emoji : '❓', `mem:${chatId}:${i}`)
  );
  const rows = [];
  for (let i = 0; i < buttons.length; i += 4) rows.push(buttons.slice(i, i + 4));
  return Markup.inlineKeyboard(rows);
}

module.exports = {
  name: 'memory',
  description: 'Play a memory matching game',
  execute: async (ctx) => {
    const board = newBoard();
    sessions.set(String(ctx.chat.id), { board, firstPick: null });
    await ctx.reply('🧠 Memory Game — find all the matching pairs!', renderBoard(board, ctx.chat.id));
  },
};
