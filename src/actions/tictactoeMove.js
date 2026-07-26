const { Markup } = require('telegraf');

const sessions = new Map(); // shared board state, keyed by chatId

function renderBoard(board, chatId) {
  const buttons = board.map((cell, i) => Markup.button.callback(cell || '·', `ttt:${chatId}:${i}`));
  return Markup.inlineKeyboard([buttons.slice(0, 3), buttons.slice(3, 6), buttons.slice(6, 9)]);
}

function checkWinner(board) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
  }
  return board.every((c) => c) ? 'draw' : null;
}

module.exports = {
  id: /^ttt:(-?\d+):(\d+)$/,
  handler: async (ctx) => {
    const chatId = ctx.match[1];
    const index = parseInt(ctx.match[2], 10);

    if (!sessions.has(chatId)) sessions.set(chatId, Array(9).fill(null));
    const board = sessions.get(chatId);

    if (board[index]) {
      await ctx.answerCbQuery('Cell already taken!');
      return;
    }

    board[index] = '❌';
    let winner = checkWinner(board);

    if (!winner) {
      // Bot picks a random empty cell
      const empty = board.map((c, i) => (c ? null : i)).filter((i) => i !== null);
      if (empty.length) {
        const botMove = empty[Math.floor(Math.random() * empty.length)];
        board[botMove] = '⭕';
        winner = checkWinner(board);
      }
    }

    await ctx.answerCbQuery();

    if (winner) {
      sessions.delete(chatId);
      const text = winner === 'draw' ? "🤝 It's a draw!" : winner === '❌' ? '🎉 You win!' : '🤖 Bot wins!';
      await ctx.editMessageText(text, renderBoard(board, chatId));
    } else {
      await ctx.editMessageReplyMarkup(renderBoard(board, chatId).reply_markup);
    }
  },
};
