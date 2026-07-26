const { Telegraf } = require('telegraf');
const config = require('./src/config/config');
const logger = require('./src/core/logger');
const commandLoader = require('./src/core/commandLoader');
const actionLoader = require('./src/core/actionLoader');
const attachErrorHandler = require('./src/core/errorHandler');

if (!config.botToken) {
  logger.error('BOT_TOKEN is missing. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const bot = new Telegraf(config.botToken);
const deps = { config, logger, commandLoader };

attachErrorHandler(bot, logger);

commandLoader.load();
actionLoader.load();
commandLoader.register(bot, deps);
actionLoader.register(bot, deps);

// Owner-only hot reload without restarting the process
bot.command('reload', async (ctx) => {
  const { isPrivileged } = require('./src/core/menuContent');
  if (!isPrivileged(ctx.from.id, config)) return;
  commandLoader.load();
  actionLoader.load();
  commandLoader.register(bot, deps);
  actionLoader.register(bot, deps);
  await ctx.reply(`🔄 Reloaded ${commandLoader.all().length} commands.`);
});

bot.launch().then(() => {
  logger.info(`${config.botName} is online with ${commandLoader.all().length} commands.`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
