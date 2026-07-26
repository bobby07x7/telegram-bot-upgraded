// Simplified chess board display + free-form move (no full legal-move
// validation — a complete chess engine is beyond a single command file).
// Good for casual play; for tournament-legal chess, integrate a library
// like "chess.js" and expand this file.
const PIECES = {
  wP: '♙', wR: '♖', wN: '♘', wB: '♗', wQ: '♕', wK: '♔',
  bP: '♟', bR: '♜', bN: '♞', bB: '♝', bQ: '♛', bK: '♚',
};

const sessions = new Map();

function initialBoard() {
  const back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  const board = [];
  board.push(back.map((p) => 'b' + p));
  board.push(Array(8).fill('bP'));
  for (let i = 0; i < 4; i++) board.push(Array(8).fill(null));
  board.push(Array(8).fill('wP'));
  board.push(back.map((p) => 'w' + p));
  return board;
}

function renderBoard(board) {
  const files = 'abcdefgh';
  let text = '  a b c d e f g h\n';
  for (let r = 0; r < 8; r++) {
    text += `${8 - r} `;
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      text += (piece ? PIECES[piece] : '·') + ' ';
    }
    text += `${8 - r}\n`;
  }
  text += '  a b c d e f g h';
  return text;
}

function squareToCoords(square) {
  const files = 'abcdefgh';
  const col = files.indexOf(square[0]);
  const row = 8 - parseInt(square[1], 10);
  return { row, col };
}

module.exports = {
  name: 'chess',
  description: 'Casual chess — /chess to start, /chess e2e4 to move a piece',
  execute: async (ctx) => {
    const chatId = ctx.chat.id;
    const arg = ctx.message.text.split(' ')[1];

    if (!arg) {
      const board = initialBoard();
      sessions.set(chatId, board);
      await ctx.reply(`♟️ Chess started!\n\`\`\`\n${renderBoard(board)}\n\`\`\`\nMove with /chess e2e4`, { parse_mode: 'Markdown' });
      return;
    }

    const board = sessions.get(chatId);
    if (!board) {
      await ctx.reply('❓ No active game. Use /chess to start.');
      return;
    }

    if (!/^[a-h][1-8][a-h][1-8]$/.test(arg)) {
      await ctx.reply('❌ Use algebraic format, e.g. /chess e2e4');
      return;
    }

    const from = squareToCoords(arg.slice(0, 2));
    const to = squareToCoords(arg.slice(2, 4));
    const piece = board[from.row][from.col];

    if (!piece) {
      await ctx.reply('❌ No piece on that starting square.');
      return;
    }

    board[to.row][to.col] = piece;
    board[from.row][from.col] = null;

    await ctx.reply(`\`\`\`\n${renderBoard(board)}\n\`\`\``, { parse_mode: 'Markdown' });
  },
};
