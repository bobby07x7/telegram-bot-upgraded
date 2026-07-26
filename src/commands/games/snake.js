const { Markup } = require('telegraf');
const sessions = require('../../core/snakeSessions');
const SIZE = 6;

function spawnFood(snake) {
  let food;
  do {
    food = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

function renderGrid(snake, food) {
  let grid = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (snake[0].x === x && snake[0].y === y) grid += '🟩';
      else if (snake.some((s) => s.x === x && s.y === y)) grid += '🟢';
      else if (food.x === x && food.y === y) grid += '🍎';
      else grid += '⬛';
    }
    grid += '\n';
  }
  return grid;
}

function controls(chatId) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('⬆️', `snake:${chatId}:up`)],
    [Markup.button.callback('⬅️', `snake:${chatId}:left`), Markup.button.callback('➡️', `snake:${chatId}:right`)],
    [Markup.button.callback('⬇️', `snake:${chatId}:down`)],
  ]);
}

module.exports = {
  name: 'snake',
  description: 'Play a mini Snake game with arrow buttons',
  execute: async (ctx) => {
    const chatId = ctx.chat.id;
    const snake = [{ x: 2, y: 2 }];
    const food = spawnFood(snake);
    sessions.set(String(chatId), { snake, food, direction: 'right', score: 0 });

    await ctx.reply(`🐍 Snake — Score: 0\n${renderGrid(snake, food)}`, controls(chatId));
  },
};
