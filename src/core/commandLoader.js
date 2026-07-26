const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

class CommandLoader {
  constructor() {
    this.commands = new Map(); // name -> command module
  }

  /** Scans every category folder and (re)loads every command file. Safe to call again for /reload. */
  load() {
    this.commands.clear();
    const categories = fs.readdirSync(COMMANDS_DIR).filter((f) =>
      fs.statSync(path.join(COMMANDS_DIR, f)).isDirectory()
    );

    for (const category of categories) {
      const dir = path.join(COMMANDS_DIR, category);
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
      for (const file of files) {
        const filePath = path.join(dir, file);
        try {
          delete require.cache[require.resolve(filePath)];
          const cmd = require(filePath);
          if (!cmd?.name || !cmd?.execute) {
            logger.warn(`Skipped invalid command file: ${category}/${file}`);
            continue;
          }
          cmd.category = cmd.category || category;
          if (this.commands.has(cmd.name)) {
            logger.warn(`Duplicate command name "${cmd.name}" in ${category}/${file} — overwritten`);
          }
          this.commands.set(cmd.name, cmd);
        } catch (err) {
          logger.error(`Failed to load ${category}/${file}: ${err.message}`);
        }
      }
    }
    logger.info(`Loaded ${this.commands.size} commands across ${categories.length} categories`);
    return this;
  }

  all() {
    return Array.from(this.commands.values());
  }

  get(name) {
    return this.commands.get(name);
  }

  /** Wires every loaded command onto the Telegraf bot instance as bot.command(name, ...). */
  register(bot, ctxDeps) {
    for (const cmd of this.all()) {
      bot.command(cmd.name, async (ctx) => {
        if (ctxDeps.config.maintenanceMode && !require('./menuContent').isPrivileged(ctx.from.id, ctxDeps.config)) {
          return ctx.reply('🛠️ Bot is under maintenance. Please try again shortly.');
        }
        if ((cmd.ownerOnly || cmd.adminOnly) &&
            !require('./menuContent').isPrivileged(ctx.from.id, ctxDeps.config)) {
          return; // silently ignore — command doesn't "exist" for this user
        }
        ctx.args = ctx.message.text.split(' ').slice(1);
        try {
          await cmd.execute(ctx, ctxDeps);
        } catch (err) {
          ctxDeps.logger.error(`Error in /${cmd.name}: ${err.stack}`);
          await ctx.reply('❌ Something went wrong running that command.').catch(() => {});
        }
      });
    }
  }
}

module.exports = new CommandLoader();
