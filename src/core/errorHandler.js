module.exports = function attachErrorHandler(bot, logger) {
  bot.catch((err, ctx) => {
    logger.error(`Unhandled error for ${ctx.updateType}: ${err.stack || err}`);
    ctx.reply?.('❌ An unexpected error occurred. The owner has been notified.').catch(() => {});
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled promise rejection: ${reason}`);
  });
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught exception: ${err.stack}`);
  });
};
