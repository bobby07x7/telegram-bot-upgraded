const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { playCombatAnimation, buildHpBar } = require('../../core/uiHelper');

const HIT_VERBS = ['punches', 'kicks', 'slams', 'uppercuts', 'tackles', 'smashes'];

module.exports = {
  name: 'fight',
  description: 'Fight another user (reply to their message). Optional bet: /fight <amount>',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from;
    if (!target) return ctx.reply('↩️ Reply to the user you want to fight.\nUsage: /fight [bet amount] (as a reply)');
    if (target.id === ctx.from.id) return ctx.reply('❌ You cannot fight yourself.');
    if (target.is_bot) return ctx.reply('🤖 You cannot fight a bot.');

    const { currencySymbol, xpPerLevel } = config.economy;
    const MAX_HP = 100;
    const RECOVERY_MS = 60 * 1000; // 1 min auto-recovery when knocked out
    const HP_XP_WIN_MIN = 25, HP_XP_WIN_RANGE = 15; // 25-39
    const HP_XP_LOSE_MIN = 8, HP_XP_LOSE_RANGE = 8; // 8-15

    // optional bet: /fight 100
    const args = ctx.message.text.trim().split(/\s+/).slice(1);
    let bet = 0;
    if (args[0]) {
      bet = parseInt(args[0], 10);
      if (isNaN(bet) || bet < 0) return ctx.reply('⚠️ Bet amount must be a positive number.\nUsage: /fight 100');
    }

    // pulls current hp, auto-reviving if the knockout timer has passed
    function resolve(userId) {
      const user = getUser(userId);
      const maxHp = user.maxHp || MAX_HP;
      let hp = user.hp ?? maxHp;
      let downedAt = user.downedAt || null;
      if (hp <= 0 && downedAt && Date.now() - downedAt >= RECOVERY_MS) {
        hp = maxHp;
        downedAt = null;
      }
      return { user, maxHp, hp, downedAt };
    }

    const r1 = resolve(ctx.from.id);
    const r2 = resolve(target.id);

    if (r1.hp <= 0) {
      const remaining = Math.ceil((RECOVERY_MS - (Date.now() - r1.downedAt)) / 1000);
      return ctx.reply(`💀 You're knocked out and recovering.\n⏳ Ready in ${remaining}s.\nUse /heal once recovered.`);
    }
    if (r2.hp <= 0) {
      const remaining = Math.ceil((RECOVERY_MS - (Date.now() - r2.downedAt)) / 1000);
      return ctx.reply(`💀 ${target.first_name} is knocked out and recovering.\n⏳ Ready in ${remaining}s.`);
    }

    if (bet > 0) {
      if (r1.user.balance < bet) return ctx.reply(`💸 You don't have ${bet}${currencySymbol}. Balance: ${r1.user.balance}${currencySymbol}.`);
      if (r2.user.balance < bet) return ctx.reply(`💸 ${target.first_name} doesn't have ${bet}${currencySymbol} to match your bet.`);
    }

    const f1 = { id: ctx.from.id, name: ctx.from.first_name, hp: r1.hp, max: r1.maxHp };
    const f2 = { id: target.id, name: target.first_name, hp: r2.hp, max: r2.maxHp };

    // --- Fully decide the fight up front (deterministic outcome), then only
    // reveal it round-by-round via the shared cinematic animation. ---
    const logLines = [];
    const hpTrackA = [];
    const hpTrackB = [];

    let attacker = Math.random() < 0.5 ? f1 : f2;
    let defender = attacker === f1 ? f2 : f1;
    let rounds = 0;
    while (f1.hp > 0 && f2.hp > 0 && rounds < 20) {
      const dmg = 8 + Math.floor(Math.random() * 15); // 8-22 damage per hit
      const verb = HIT_VERBS[Math.floor(Math.random() * HIT_VERBS.length)];
      const crit = dmg >= 20;
      defender.hp = Math.max(0, defender.hp - dmg);
      logLines.push(`${attacker.name} ${verb} ${defender.name} for ${dmg} dmg${crit ? ' — CRITICAL!' : ''}`);
      hpTrackA.push(f1.hp);
      hpTrackB.push(f2.hp);
      [attacker, defender] = [defender, attacker];
      rounds++;
    }

    const winner = f1.hp > 0 ? f1 : f2;
    const loser = winner === f1 ? f2 : f1;
    const winnerRecord = winner === f1 ? r1.user : r2.user;
    const loserRecord = loser === f1 ? r1.user : r2.user;

    const winXp = HP_XP_WIN_MIN + Math.floor(Math.random() * HP_XP_WIN_RANGE);
    const loseXp = HP_XP_LOSE_MIN + Math.floor(Math.random() * HP_XP_LOSE_RANGE);

    function applyXp(user, gained) {
      const newXp = user.xp + gained;
      const newLevel = Math.floor(newXp / xpPerLevel) + 1;
      return { xp: newXp, level: newLevel, leveledUp: newLevel > user.level };
    }

    const winXpResult = applyXp(winnerRecord, winXp);
    const loseXpResult = applyXp(loserRecord, loseXp);

    let winnerHp = winner.hp;
    let loserHp = loser.hp;
    let loserDownedAt = loser.hp === 0 ? Date.now() : null;

    if (winXpResult.leveledUp) winnerHp = winner.max; // free full heal on level-up
    if (loseXpResult.leveledUp) { loserHp = loser.max; loserDownedAt = null; }

    let winnerBalance = winnerRecord.balance;
    let loserBalance = loserRecord.balance;
    let moneyLine = '';
    if (bet > 0) {
      winnerBalance += bet;
      loserBalance -= bet;
      moneyLine = `\n💰 ${winner.name} won ${bet * 2}${currencySymbol}!`;
    }

    saveUser(winner.id, { hp: winnerHp, maxHp: winner.max, downedAt: null, xp: winXpResult.xp, level: winXpResult.level, balance: winnerBalance });
    saveUser(loser.id, { hp: loserHp, maxHp: loser.max, downedAt: loserDownedAt, xp: loseXpResult.xp, level: loseXpResult.level, balance: loserBalance });

    addHistory(winner.id, { type: 'fight win', vs: loser.name, xpGained: winXp, bet });
    addHistory(loser.id, { type: 'fight loss', vs: winner.name, xpGained: loseXp, bet });

    const levelLines = [
      winXpResult.leveledUp ? `🎉 ${winner.name} leveled up to Lv.${winXpResult.level}! (full HP restored)` : null,
      loseXpResult.leveledUp ? `🎉 ${loser.name} leveled up to Lv.${loseXpResult.level}! (full HP restored)` : null,
    ].filter(Boolean).join('\n');

    const footer = loserHp === 0
      ? `💀 ${loser.name} is down and will auto-recover in 1 min, or use /heal once the timer is up.`
      : `${loser.name} ${buildHpBar(loserHp, loser.max)}\n⚠️ Getting low — use /heal before the next fight!`;

    const resultText =
      `🏆 *${winner.name} WINS THE FIGHT!*\n\n` +
      `${winner.name} ${buildHpBar(winnerHp, winner.max)}\n\n` +
      `✨ ${winner.name} +${winXp} XP | ${loser.name} +${loseXp} XP${moneyLine}` +
      `${levelLines ? '\n' + levelLines : ''}\n\n${footer}`;

    await playCombatAnimation(ctx, {
      fighterA: { name: f1.name, hp: f1.max, maxHp: f1.max },
      fighterB: { name: f2.name, hp: f2.max, maxHp: f2.max },
      logLines,
      liveHp: { a: hpTrackA, b: hpTrackB },
      introLabel: `🥊 ${f1.name} vs ${f2.name}`,
      resultText,
      extra: { parse_mode: 'Markdown' },
      frameDelayMs: 850,
    });
  },
};
