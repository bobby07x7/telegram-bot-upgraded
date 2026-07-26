const { getGroup, saveGroup, addGroupLog } = require('../../database/store');

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

module.exports = {
  name: 'scan',
  description: 'Run a basic spam-risk scan on a member (reply to their message)',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from || ctx.from;
    let risk = 0;
    const reasons = [];

    if (!target.username) { risk += 15; reasons.push('No username set'); }
    if (target.is_bot) { risk += 40; reasons.push('Account is a bot'); }

    const member = await ctx.telegram.getChatMember(ctx.chat.id, target.id).catch(() => null);
    if (member && member.status === 'member' && member.until_date) { risk += 10; reasons.push('Recently joined'); }

    const level = risk >= 40 ? 'HIGH ⚠️' : risk >= 15 ? 'MEDIUM ⚡' : 'LOW ✅';
    await ctx.reply(`🔍 *Spam Risk Scan: ${target.first_name}*\n\nRisk level: ${level} (${risk}/100)\n${reasons.length ? reasons.map((r) => `• ${r}`).join('\n') : '• No risk signals detected'}`, { parse_mode: 'Markdown' });
  },
};
