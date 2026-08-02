const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const ACTIONS_DIR = path.join(__dirname, '..', 'actions');

/**
 * Each action file's format:
 * module.exports = {
 *   id: 'menu:close',           // matched against callback_data (string or RegExp)
 *   handler: async (ctx, { config, logger }) => { ... }
 * }
 *
 * TO ADD A NEW INLINE BUTTON HANDLER:
 * 1. Create a new .js file inside src/actions/
 * 2. Export it in the format above
 * 3. When building the button, use Markup.button.callback('Label', 'same_id')
 */
function loadActions() {
  const actions = new Map();

  if (!fs.existsSync(ACTIONS_DIR)) {
    logger.warn(`Actions directory not found: ${ACTIONS_DIR}`);
    return actions;
  }

  const files = fs.readdirSync(ACTIONS_DIR).filter((file) => file.endsWith('.js'));

  for (const file of files) {
    try {
      const action = require(path.join(ACTIONS_DIR, file));
      if (!action.id || typeof action.handler !== 'function') {
        logger.warn(`Skipping invalid action file: ${file} (missing "id" or "handler")`);
        continue;
      }
      actions.set(action.id, action);
      logger.info(`Loaded action: ${action.id} (${file})`);
    } catch (err) {
      logger.error(`Failed to load action file ${file}: ${err.message}`);
    }
  }

  return actions;
}

module.exports = { loadActions, ACTIONS_DIR };
