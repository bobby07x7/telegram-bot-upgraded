const { Markup } = require('telegraf');
const sessions = require('../core/memorySessions');

function renderBoard(board, chatId) {
  const buttons = board.map((cell, i) =>
    Markup.button.callback(cell.matched || cell.revealed ? cell.emoji : '❓', `mem:${chatId}:${i}`)
  );
  const rows = [];
  for (let i = 0; i < buttons.length; i += 4) rows.push(buttons.slice(i, i + 4));
  return Markup.inlineKeyboard(rows);
}

module.exports = {
  id: /^mem:(-?\d+):(\d+)$/,
  handler: async (ctx) => {
    const chatId = ctx.match[1];
    const index = parseInt(ctx.match[2], 10);
    const session = sessions.get(chatId);

    if (!session) {
      await ctx.answerCbQuery('No active game. Start one with /memory');
      return;
    }

    const { board } = session;
    if (board[index].matched || board[index].revealed) {
      await ctx.answerCbQuery();
      return;
    }

    board[index].revealed = true;

    if (session.firstPick === null) {
      session.firstPick = index;
      await ctx.answerCbQuery();
      await ctx.editMessageReplyMarkup(renderBoard(board, chatId).reply_markup);
      return;
    }

    // Second pick — check match
    const first = board[session.firstPick];
    const second = board[index];
    await ctx.answerCbQuery();

    if (first.emoji === second.emoji) {
      first.matched = true;
      second.matched = true;
      session.firstPick = null;

      if (board.every((c) => c.matched)) {
        sessions.delete(chatId);
        await ctx.editMessageText('🎉 You matched all pairs! Well played.', renderBoard(board, chatId));
        return;
      }
      await ctx.editMessageReplyMarkup(renderBoard(board, chatId).reply_markup);
    } else {
      await ctx.editMessageReplyMarkup(renderBoard(board, chatId).reply_markup);
      setTimeout(async () => {
        first.revealed = false;
        second.revealed = false;
        session.firstPick = null;
        try {
          await ctx.editMessageReplyMarkup(renderBoard(board, chatId).reply_markup);
        } catch (_) { /* message may have changed */ }
      }, 1200);
    }
  },
};
