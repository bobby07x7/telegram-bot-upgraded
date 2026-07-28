const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { protectMessage, isProtectedTarget } = require('../../core/godProtect');

const ROB_COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours between attempts
const ROB_MIN_TARGET_BALANCE = 100; // target must have at least this much to be worth robbing
const ROB_BASE_SUCCESS_RATE = 0.4; // 40% base chance of success
const ROB_LEVEL_BONUS_PER_GAP = 0.02; // +2% per level you're above the target (and vice versa)
const ROB_SUCCESS_RATE_MIN = 0.15;
const ROB_SUCCESS_RATE_MAX = 0.75;
const ROB_MAX_STEAL_PERCENT = 0.3; // steal up to 30% of target's wallet
const ROB_FINE_PERCENT = 0.15; // lose 15% of your own wallet if caught
const ROB_JAIL_CHANCE_ON_FAIL = 0.4; // 40% of failed attempts also land you in jail
const ROB_JAIL_MIN_MS = 15 * 60 * 1000; // 15 minutes
const ROB_JAIL_MAX_MS = 45 * 60 * 1000; // 45 minutes
const ROB_XP_ON_SUCCESS = 15;

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

    const jailRemaining = (robber.jailedUntil || 0) - now;
    if (jailRemaining > 0) {
      const mins = Math.ceil(jailRemaining / 60000);
      return ctx.reply(`🚔 You're still in jail for ~${mins}m. No crime for you right now.`);
    }

    const cooldownRemaining = (robber.lastRob || 0) + ROB_COOLDOWN_MS - now;
    if (cooldownRemaining > 0) {
      const mins = Math.ceil(cooldownRemaining / 60000);
      return ctx.reply(`⏳ You're laying low after your last attempt. Try again in ~${mins}m.`);
    }

    const victim = getUser(target.id);
    if (victim.balance < ROB_MIN_TARGET_BALANCE) {
      return ctx.reply(`❌ ${target.first_name} doesn't have enough coins in their wallet to be worth robbing.`);
    }

    // Higher-level robbers hitting lower-level targets have better odds, and
    // vice versa — makes level actually matter for crime, not just combat.
    const levelGap = (robber.level || 1) - (victim.level || 1);
    const successRate = Math.min(
      ROB_SUCCESS_RATE_MAX,
      Math.max(ROB_SUCCESS_RATE_MIN, ROB_BASE_SUCCESS_RATE + levelGap * ROB_LEVEL_BONUS_PER_GAP)
    );
    const success = Math.random() < successRate;

    if (success) {
      const stealPercent = Math.random() * ROB_MAX_STEAL_PERCENT;
      const amount = Math.max(1, Math.floor(victim.balance * stealPercent));
      const streak = (robber.robStreak || 0) + 1;

      saveUser(target.id, { balance: victim.balance - amount });
      saveUser(robberId, {
        balance: robber.balance + amount,
        lastRob: now,
        robStreak: streak,
        xp: (robber.xp || 0) + ROB_XP_ON_SUCCESS,
      });
      addHistory(robberId, { type: 'rob success', amount, from: target.id });
      addHistory(target.id, { type: 'robbed', amount: -amount, by: robberId });

      const streakNote = streak >= 3 ? `\n🔥 ${streak} successful robberies in a row!` : '';
      await ctx.reply(
        `🦹 You successfully robbed ${target.first_name} and got away with ${amount}${config.economy.currencySymbol}! (+${ROB_XP_ON_SUCCESS} XP)${streakNote}`
      );
    } else {
      const fineAmount = Math.max(1, Math.floor(robber.balance * ROB_FINE_PERCENT));
      const newBalance = Math.max(0, robber.balance - fineAmount);
      const actualFine = robber.balance - newBalance;

      const goesToJail = Math.random() < ROB_JAIL_CHANCE_ON_FAIL;
      const jailMs = ROB_JAIL_MIN_MS + Math.random() * (ROB_JAIL_MAX_MS - ROB_JAIL_MIN_MS);

      saveUser(robberId, {
        balance: newBalance,
        lastRob: now,
        robStreak: 0,
        jailedUntil: goesToJail ? now + jailMs : robber.jailedUntil || 0,
      });
      addHistory(robberId, { type: 'rob failed', amount: -actualFine });

      const jailNote = goesToJail
        ? `\n🚔 You got caught red-handed and thrown in jail for ${Math.ceil(jailMs / 60000)}m!`
        : '';
      await ctx.reply(
        `🚨 You got caught trying to rob ${target.first_name}! You paid a fine of ${actualFine}${config.economy.currencySymbol}.${jailNote}`
      );
    }
  },
};
