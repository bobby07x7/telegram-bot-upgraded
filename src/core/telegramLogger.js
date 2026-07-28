const { config } = require('../config/config');
const logger = require('./logger');

/** Escapes legacy-Markdown-significant characters in user-controlled text
 * (names, usernames) before it's interpolated into a Markdown-parsed
 * message — prevents "can't parse entities" crashes from names containing
 * underscores, asterisks, backticks, or brackets. */
function escapeMd(text) {
  return String(text ?? '').replace(/([_*[\]`])/g, '\\$1');
}

/**
 * Posts a message to the configured log group (config.bot.logGroupId).
 * Silently no-ops if no log group is configured, and never throws —
 * a failed log post (bot not in the group, group deleted, etc.) must
 * never crash or block the actual command/event that triggered it.
 *
 * @param {*} bot Telegraf bot instance (or ctx.telegram)
 * @param {string} text message to post
 * @param {object} extra optional parse_mode / reply_markup
 */
async function logToGroup(bot, text, extra = {}) {
  const groupId = config.bot.logGroupId;
  if (!groupId) return;

  try {
    const telegram = bot.telegram || bot; // accept either a Telegraf instance or ctx.telegram
    await telegram.sendMessage(groupId, text, { parse_mode: 'Markdown', ...extra });
  } catch (err) {
    // Don't let a broken/misconfigured log group take down real functionality —
    // just note it once in the regular file logger.
    logger.warn(`Failed to post to log group (${groupId}): ${err.message}`);
  }
}

/** Bot process started. */
function logStartup(bot, { commandCount, actionCount, username }) {
  return logToGroup(
    bot,
    `🟢 *Bot started*\n` +
      `🤖 @${username}\n` +
      `📦 ${commandCount} commands, ${actionCount} actions loaded\n` +
      `🕐 ${new Date().toISOString()}`
  );
}

/** First-ever /start or interaction from a brand-new user. */
function logNewUser(bot, from) {
  const name = escapeMd(from.first_name || 'Unknown');
  const username = from.username ? `@${escapeMd(from.username)}` : '_no username_';
  return logToGroup(
    bot,
    `🆕 *New user*\n` +
      `👤 ${name} (${username})\n` +
      `🆔 \`${from.id}\``
  );
}

/** A group added/removed the bot, or another notable group event. */
function logGroupEvent(bot, text) {
  return logToGroup(bot, `👥 *Group event*\n${text}`);
}

/** Uncaught error anywhere in the bot — command execution, global handlers, etc. */
function logError(bot, source, err) {
  const message = (err && (err.stack || err.message)) || String(err);
  // Telegram messages cap at 4096 chars; keep the log line well under that.
  const trimmed = message.length > 1200 ? message.slice(0, 1200) + '…' : message;
  return logToGroup(bot, `🔴 *Error* in \`${source}\`\n\`\`\`\n${trimmed}\n\`\`\``);
}

module.exports = { logToGroup, logStartup, logNewUser, logGroupEvent, logError };
