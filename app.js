const { Telegraf } = require('telegraf');
const { config, validateConfig } = require('./src/config/config');
const logger = require('./src/core/logger');
const { loadCommands } = require('./src/core/commandLoader');
const { loadActions } = require('./src/core/actionLoader');
const { safeExecute, registerGlobalHandlers } = require('./src/core/errorHandler');
const { getState } = require('./src/database/botState');
const { isOwnerOrAdmin } = require('./src/core/permissions');
const { trackUser } = require('./src/database/store');
const { logStartup, logNewUser, logError } = require('./src/core/telegramLogger');

async function bootstrap() {
  validateConfig();

  const bot = new Telegraf(config.bot.token);
  const commands = loadCommands();
  const actions = loadActions();

  registerGlobalHandlers(bot);

  // Keep a username -> id index up to date on every update, so
  // reply/@mention-based targeting (ban, warn, gift, send, etc.) works
  // even for users the bot has only seen once, in any chat.
  bot.use((ctx, next) => {
    try {
      const { isNew } = trackUser(ctx.from);
      if (isNew) {
        const state = getState();
        if (!state.logIgnoreList.includes(String(ctx.from.id))) {
          logNewUser(bot, ctx.from); // fire-and-forget, never blocks the update
        }
      }
      if (ctx.message?.reply_to_message?.from) trackUser(ctx.message.reply_to_message.from);
    } catch (err) {
      logger.error(`trackUser middleware failed: ${err.message}`);
    }
    return next();
  });

  // Register every loaded command as a Telegram /command
  for (const command of commands.values()) {
    bot.command(command.name, (ctx) => {
      const state = getState();

      if (command.ownerOnly && !isOwnerOrAdmin(ctx.from.id)) {
        return ctx.reply('🚫 This command is owner-only.');
      }
      if (state.disabledCommands.includes(command.name) && !isOwnerOrAdmin(ctx.from.id)) {
        return ctx.reply('⛔ This command is currently disabled.');
      }
      if (state.maintenance && !isOwnerOrAdmin(ctx.from.id)) {
        return ctx.reply('🛠️ The bot is currently under maintenance. Please try again later.');
      }

      // Fire the native "typing..." indicator before every command runs —
      // makes the bot feel alive/responsive even before the reply lands.
      // Fire-and-forget: never blocks or fails the actual command.
      ctx.telegram.sendChatAction(ctx.chat.id, 'typing').catch(() => {});

      return safeExecute(command)(ctx, { config, logger, commands });
    });
  }

  // Register every loaded action (inline button handler)
  for (const action of actions.values()) {
    bot.action(action.id, async (ctx) => {
      try {
        await action.handler(ctx, { config, logger, commands });
      } catch (err) {
        logger.error(`Error in action "${action.id}": ${err.stack || err.message}`);
        logError(bot, `action:${action.id}`, err);
        try {
          await ctx.answerCbQuery('❌ Something went wrong.');
        } catch (_) {
          /* ignore */
        }
      }
    });
  }

  await bot.launch();
  logger.info(`✅ Bot started with ${commands.size} command(s) and ${actions.size} action(s) loaded.`);
  const botInfo = await bot.telegram.getMe();
  logStartup(bot, { commandCount: commands.size, actionCount: actions.size, username: botInfo.username });

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

bootstrap().catch((err) => {
  logger.error(`❌ Failed to start bot: ${err.stack || err.message}`);

  if (err && (err.code === 'ENOTFOUND' || /ENOTFOUND|getaddrinfo/i.test(err.message || ''))) {
    logger.error('Network error: DNS lookup failed for api.telegram.org. Check your internet connection, DNS, proxy/hosts, or firewall settings.');
    logger.error('If you run behind a proxy, set the HTTP_PROXY/HTTPS_PROXY environment variables or configure a system proxy.');
  }

  process.exit(1);
});
