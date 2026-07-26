module.exports = {
  name: 'heal',
  description: 'Recover HP between fights',
  execute: async (ctx) => {
    const { getUser, saveUser } = require('../../database/store');

    const MAX_HP = 100;
    const RECOVERY_MS = 60 * 1000;
    const HEAL_AMOUNT = 25;
    const HEAL_COOLDOWN_MS = 20 * 1000;

    const user = getUser(ctx.from.id);
    const maxHp = user.maxHp || MAX_HP;
    let hp = user.hp ?? maxHp;
    let downedAt = user.downedAt || null;

    if (hp <= 0 && downedAt) {
      const elapsed = Date.now() - downedAt;
      if (elapsed >= RECOVERY_MS) {
        hp = maxHp;
        downedAt = null;
        saveUser(ctx.from.id, { hp, downedAt });
      } else {
        const remaining = Math.ceil((RECOVERY_MS - elapsed) / 1000);
        return ctx.reply(`💀 You're knocked out. ⏳ Auto-recovery in ${remaining}s.`);
      }
    }

    if (hp >= maxHp) {
      return ctx.reply(`✅ You're already at full HP (${maxHp}/${maxHp}).`);
    }

    const now = Date.now();
    const lastHeal = user.lastHeal || 0;
    if (now - lastHeal < HEAL_COOLDOWN_MS) {
      const remaining = Math.ceil((HEAL_COOLDOWN_MS - (now - lastHeal)) / 1000);
      return ctx.reply(`⏳ Heal is on cooldown. Try again in ${remaining}s.`);
    }

    const newHp = Math.min(maxHp, hp + HEAL_AMOUNT);
    saveUser(ctx.from.id, { hp: newHp, lastHeal: now, downedAt: null });

    await ctx.reply(`💚 ${ctx.from.first_name} healed up! HP: ${newHp}/${maxHp}`);
  },
};
