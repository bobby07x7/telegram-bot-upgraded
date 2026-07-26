const logger = require('./logger');

/**
 * Instead of wrapping every command's execute() in a try/catch,
 * we use this wrapper — if an error occurs anywhere, the bot won't crash
 * and the user gets a friendly message instead.
 */
function safeExecute(command) {
  return async (ctx, extras) => {
    try {
      await command.execute(ctx, extras);
    } catch (err) {
      logger.error(`Error in command "/${command.name}": ${err.stack || err.message}`);
      try {
        await ctx.reply('❌ Something went wrong. Please try again in a moment.');
      } catch (_) {
        // the reply itself might fail too (e.g. bot blocked) — ignore it
      }
    }
  };
}

function registerGlobalHandlers(bot) {
  // Telegraf-level errors (network issues, etc.)
  bot.catch((err, ctx) => {
    logger.error(`Unhandled bot error for update ${ctx.updateType}: ${err.stack || err.message}`);
  });

  // Node process-level safety nets
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Promise Rejection: ${reason}`);
  });

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.stack || err.message}`);
  });
}

module.exports = { safeExecute, registerGlobalHandlers };
