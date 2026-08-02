const { config } = require('../config/config');
const { getState } = require('../database/botState');

/**
 * Is this user the bot owner, or an admin promoted via /addadmin?
 * Shared everywhere (command gating, menu filtering, action handlers)
 * so there's exactly one definition of "who can see owner-only stuff".
 */
function isOwnerOrAdmin(userId) {
  const state = getState();
  return String(userId) === String(config.bot.ownerId) || state.extraAdmins.includes(String(userId));
}

/**
 * Shared permission checks used across all group-moderation commands.
 * Centralized here so behavior (and any future change, like adding a
 * custom-admin list) only needs to be updated in one place.
 */
async function requireGroupAdmin(ctx) {
  if (ctx.chat.type === 'private') {
    await ctx.reply('❌ This command only works in groups.');
    return false;
  }
  const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
  if (!['administrator', 'creator'].includes(member.status)) {
    await ctx.reply('🚫 You need to be a group admin to use this command.');
    return false;
  }
  return true;
}

function isPrivateChat(ctx) {
  return ctx.chat?.type === 'private';
}

/**
 * Simple reply-only target getter, used by the couple of commands that
 * intentionally only support "reply to a message" (not @mention) — e.g.
 * /approve, since approving is about a specific message, not a user lookup.
 */
function getReplyTarget(ctx) {
  return ctx.message.reply_to_message?.from || null;
}

module.exports = { requireGroupAdmin, isPrivateChat, isOwnerOrAdmin, getReplyTarget };
