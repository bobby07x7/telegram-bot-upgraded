const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

/**
 * Command file format:
 * module.exports = {
 *   name: 'ping',
 *   description: 'Check bot response speed',
 *   category: 'utility',   // optional — auto-filled from folder name if omitted
 *   ownerOnly: false,
 *   execute: async (ctx, { config, logger, commands }) => { ... }
 * }
 *
 * TO ADD A NEW COMMAND:
 * 1. Create a new .js file inside src/commands/<category>/
 * 2. Export it in the format above
 * 3. Restart the bot — it auto-registers. No other file needs editing.
 */
function loadCommands() {
  const commands = new Map();

  if (!fs.existsSync(COMMANDS_DIR)) {
    logger.warn(`Commands directory not found: ${COMMANDS_DIR}`);
    return commands;
  }

  const categoryFolders = fs.readdirSync(COMMANDS_DIR).filter((f) =>
    fs.statSync(path.join(COMMANDS_DIR, f)).isDirectory()
  );

  for (const folder of categoryFolders) {
    const folderPath = path.join(COMMANDS_DIR, folder);
    const files = fs.readdirSync(folderPath).filter((f) => f.endsWith('.js'));

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      try {
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);

        if (!command.name || typeof command.execute !== 'function') {
          logger.warn(`Skipping invalid command file: ${folder}/${file} (missing "name" or "execute")`);
          continue;
        }

        if (!command.category) command.category = folder;

        if (commands.has(command.name)) {
          logger.warn(`Duplicate command name "${command.name}" in ${folder}/${file} — overwriting.`);
        }

        commands.set(command.name, command);
        logger.info(`Loaded command: /${command.name} [${command.category}] (${folder}/${file})`);
      } catch (err) {
        logger.error(`Failed to load command file ${folder}/${file}: ${err.message}`);
      }
    }
  }

  return commands;
}

module.exports = { loadCommands, COMMANDS_DIR };
