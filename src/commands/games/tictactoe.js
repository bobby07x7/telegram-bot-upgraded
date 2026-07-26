// Single-player Tic-Tac-Toe vs the bot. Board state and move logic live in
// src/actions/tictactoeMove.js (handles the inline button taps).
const { Markup } = require('telegraf');

module.exports = {
  name: 'tictactoe',
  description: 'Play Tic-Tac-Toe vs the bot',
  execute: async (ctx) => {
    const board = Array(9).fill(null);
    const buttons = board.map((cell, i) => Markup.button.callback('·', `ttt:${ctx.chat.id}:${i}`));
    const keyboard = Markup.inlineKeyboard([buttons.slice(0, 3), buttons.slice(3, 6), buttons.slice(6, 9)]);
    await ctx.reply("❌⭕ Tic-Tac-Toe — you're ❌, bot is ⭕. Tap a cell:", keyboard);
  },
};
