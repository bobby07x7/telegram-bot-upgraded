const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { protectMessage, isProtectedTarget } = require('../../core/godProtect');

const ROB_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours between attempts
const ROB_MIN_TARGET_BALANCE = 100; // target must have at least this much to be worth robbing
const ROB_SUCCESS_RATE = 0.4; // 40% chance of success
const ROB_MAX_STEAL_PERCENT = 0.3; // steal up to 30% of target's wallet
const ROB_FINE_PERCENT = 0.15; // lose 15% of your own wallet if caught

module.exports = {
  name: 'rob',
  description: 'Attempt to rob coins from another user (reply to their message)',
  execute: async (ctx) => {
    const robberId = ctx.from.id;
    const target = ctx.message.reply_to_message?.from;

    if (!target) return ctx.reply('↩️ Reply to the user you want to rob.\nUsage: /rob (as a reply)');
    if (target.id === robberId) return ctx.reply('❌ You cannot rob yourself.');
    if (target.is_bot) return ctx.reply('🤖 You cannot rob a bot.');
    if (isProtectedTarget(target.id)) {
      return ctx.reply(protectMessage(target.first_name), { parse_mode: 'Markdown' });
    }

    const robber = getUser(robberId);
    const now = Date.now();
    const remaining = (robber.lastRob || 0) + ROB_COOLDOWN_MS - now;

    if (remaining > 0) {
      const mins = Math.ceil(remaining / 60000);
      return ctx.reply(`⏳ You're laying low after your last attempt. Try again in ~${mins}m.`);
    }

    const victim = getUser(target.id);
    if (victim.balance < ROB_MIN_TARGET_BALANCE) {
      return ctx.reply(`❌ ${target.first_name} doesn't have enough coins in their wallet to be worth robbing.`);
    }

    const success = Math.random() < ROB_SUCCESS_RATE;

    if (success) {
      const stealPercent = Math.random() * ROB_MAX_STEAL_PERCENT;
      const amount = Math.max(1, Math.floor(victim.balance * stealPercent));

      saveUser(target.id, { balance: victim.balance - amount });
      saveUser(robberId, { balance: robber.balance + amount, lastRob: now });
      addHistory(robberId, { type: 'rob success', amount, from: target.id });
      addHistory(target.id, { type: 'robbed', amount: -amount, by: robberId });

      await ctx.reply(`🦹 You successfully robbed ${target.first_name} and got away with ${amount}${config.economy.currencySymbol}!`);
    } else {
      const fineAmount = Math.max(1, Math.floor(robber.balance * ROB_FINE_PERCENT));
      const newBalance = Math.max(0, robber.balance - fineAmount);
      const actualFine = robber.balance - newBalance;

      saveUser(robberId, { balance: newBalance, lastRob: now });
      addHistory(robberId, { type: 'rob failed', amount: -actualFine });

      await ctx.reply(`🚨 You got caught trying to rob ${target.first_name}! You paid a fine of ${actualFine}${config.economy.currencySymbol}.`);
    }
  },
};
