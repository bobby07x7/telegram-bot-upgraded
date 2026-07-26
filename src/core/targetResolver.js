const { resolveUsername } = require('../database/store');

/**
 * Resolves the "target user" of a command from, in priority order:
 *   1. Replying to their message           (/ban  as a reply)
 *   2. A text_mention entity                (mentioning someone with no @username)
 *   3. An @username entity the bot has seen before (looked up via the
 *      username -> id index built by the trackUser() middleware)
 *   4. A raw numeric user id typed as an argument
 *
 * Returns { id, first_name, username } or null if nothing could be resolved.
 * Also returns `rest`: the command text with the mention/id argument
 * stripped out, so callers can still parse amounts/item names etc.
 */
function resolveTarget(ctx, { allowIdArg = false } = {}) {
  const message = ctx.message;
  if (!message) return { target: null, rest: '' };

  // 1. Reply to a message
  if (message.reply_to_message?.from) {
    const from = message.reply_to_message.from;
    const rest = message.text.split(' ').slice(1).join(' ').trim();
    return { target: { id: from.id, first_name: from.first_name, username: from.username }, rest };
  }

  const text = message.text || '';
  const entities = message.entities || [];

  // 2. text_mention entity (mentioning a user without a public @username)
  const textMention = entities.find((e) => e.type === 'text_mention' && e.user);
  if (textMention) {
    const rest = (text.slice(0, textMention.offset) + text.slice(textMention.offset + textMention.length))
      .replace(/^\/\S+\s*/, '')
      .trim();
    return {
      target: { id: textMention.user.id, first_name: textMention.user.first_name, username: textMention.user.username },
      rest,
    };
  }

  // 3. @username mention entity — resolved against everyone the bot has seen
  const mentionEntity = entities.find((e) => e.type === 'mention');
  if (mentionEntity) {
    const raw = text.substr(mentionEntity.offset, mentionEntity.length);
    const id = resolveUsername(raw);
    const rest = (text.slice(0, mentionEntity.offset) + text.slice(mentionEntity.offset + mentionEntity.length))
      .replace(/^\/\S+\s*/, '')
      .trim();
    if (id) {
      return { target: { id, first_name: raw, username: raw.replace(/^@/, '') }, rest };
    }
    return { target: null, rest, unresolvedMention: raw };
  }

  // 4. Raw numeric id as the first argument — ONLY for commands that opt in
  // (e.g. /ban, /unban), since for economy commands like /send <amount> the
  // first number is an amount, not a user id, and must never be confused for one.
  if (allowIdArg) {
    const parts = text.trim().split(/\s+/).slice(1);
    if (parts[0] && /^\d{4,}$/.test(parts[0])) {
      return { target: { id: parts[0], first_name: `User ${parts[0]}`, username: null }, rest: parts.slice(1).join(' ') };
    }
  }

  return { target: null, rest: text.replace(/^\/\S+\s*/, '').trim() };
}

module.exports = { resolveTarget };
