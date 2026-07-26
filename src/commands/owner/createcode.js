const { createCode } = require('../../core/codeStore');
const { findItem, displayName } = require('../../database/items');
const { config } = require('../../config/config');

module.exports = {
  name: 'createcode',
  description: 'Create a redeem code — /createcode <CODE> coins <amount> [maxUses] [expiresInHours]\nor /createcode <CODE> item <itemId> [maxUses] [expiresInHours]',
  ownerOnly: true,
  execute: async (ctx) => {
    const args = ctx.message.text.trim().split(/\s+/).slice(1);
    const [rawCode, rawType, rawValue, rawMaxUses, rawExpiresHours] = args;

    if (!rawCode || !rawType || !rawValue) {
      return ctx.reply(
        '📝 *Usage*\n' +
          '`/createcode <CODE> coins <amount> [maxUses] [expiresInHours]`\n' +
          '`/createcode <CODE> item <itemId> [maxUses] [expiresInHours]`\n\n' +
          '*Examples*\n' +
          '`/createcode WELCOME2026 coins 500`\n' +
          '`/createcode LAUNCH100 coins 1000 100` _(only first 100 people)_\n' +
          '`/createcode WEEKEND coins 200 0 48` _(unlimited uses, expires in 48h)_\n' +
          '`/createcode FREESWORD item sword 50`',
        { parse_mode: 'Markdown' }
      );
    }

    const type = rawType.toLowerCase();
    if (type !== 'coins' && type !== 'item') {
      return ctx.reply('❌ Type must be `coins` or `item`.', { parse_mode: 'Markdown' });
    }

    let value;
    if (type === 'coins') {
      value = parseInt(rawValue, 10);
      if (isNaN(value) || value <= 0) return ctx.reply('❌ Coin amount must be a positive number.');
    } else {
      const item = findItem(rawValue);
      if (!item) return ctx.reply(`❌ Unknown item id "${rawValue}". Check /items for valid ids.`);
      value = item.id;
    }

    // 0 or omitted = unlimited uses
    const maxUsesNum = parseInt(rawMaxUses, 10);
    const maxUses = !rawMaxUses || isNaN(maxUsesNum) || maxUsesNum <= 0 ? null : maxUsesNum;

    const expiresHoursNum = parseFloat(rawExpiresHours);
    const expiresAt = !rawExpiresHours || isNaN(expiresHoursNum) || expiresHoursNum <= 0
      ? null
      : Date.now() + expiresHoursNum * 60 * 60 * 1000;

    const created = createCode({
      code: rawCode,
      type,
      value,
      maxUses,
      expiresAt,
      createdBy: ctx.from.id,
    });

    const valueLine = type === 'coins'
      ? `${value}${config.economy.currencySymbol}`
      : displayName(findItem(value));

    await ctx.reply(
      `✅ *Redeem code created!*\n\n` +
        `🎟️ Code: \`${rawCode.trim().toUpperCase()}\`\n` +
        `🎁 Reward: ${valueLine}\n` +
        `👥 Max uses: ${created.maxUses === null ? 'Unlimited' : created.maxUses}\n` +
        `⏳ Expires: ${created.expiresAt ? new Date(created.expiresAt).toLocaleString() : 'Never'}\n\n` +
        `Users can now claim it with:\n\`/redeem ${rawCode.trim().toUpperCase()}\``,
      { parse_mode: 'Markdown' }
    );
  },
};
