const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const ACTIONS_DIR = path.join(__dirname, '..', 'actions');

class ActionLoader {
  load() {
    this.actions = [];
    const files = fs.readdirSync(ACTIONS_DIR).filter((f) => f.endsWith('.js'));
    for (const file of files) {
      try {
        delete require.cache[require.resolve(path.join(ACTIONS_DIR, file))];
        const action = require(path.join(ACTIONS_DIR, file));
        // each file exports { pattern: RegExp|string, handle: (ctx, deps) => {} }
        this.actions.push(action);
      } catch (err) {
        logger.error(`Failed to load action ${file}: ${err.message}`);
      }
    }
    logger.info(`Loaded ${this.actions.length} action handler(s)`);
    return this;
  }

  register(bot, deps) {
    bot.action('ui:close', async (ctx) => {
      await ctx.deleteMessage().catch(() => {});
      await ctx.answerCbQuery().catch(() => {});
    });
    bot.action('ui:noop', async (ctx) => ctx.answerCbQuery().catch(() => {}));

    for (const action of this.actions) {
      bot.action(action.pattern, async (ctx) => {
        try {
          await action.handle(ctx, deps);
        } catch (err) {
          deps.logger.error(`Action error (${action.pattern}): ${err.stack}`);
        }
        await ctx.answerCbQuery().catch(() => {});
      });
    }
  }
}

module.exports = new ActionLoader();
