const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { rollItem } = require('../../core/gachaEngine');

module.exports = {
  name: 'upgrade',
  description: 'Combine 3 items of the same rarity to upgrade one tier — /upgrade <rarity>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const rarityKey = (ctx.message.text.split(' ')[1] || '').trim().toLowerCase();
    const rarities = config.gacha.rarities.map((r) => r.key);
    const idx = rarities.indexOf(rarityKey);

    if (idx === -1) return ctx.reply(`Usage: /upgrade <rarity>\nValid: ${rarities.join(', ')}`);
    if (idx === rarities.length - 1) return ctx.reply('❌ This is already the highest rarity.');

    const user = getUser(id);
    const rarityEmoji = config.gacha.rarities[idx].emoji;
    const matching = user.inventory.filter((i) => i.startsWith(rarityEmoji));

    if (matching.length < 3) return ctx.reply(`❌ You need 3 items of ${config.gacha.rarities[idx].label} rarity (you have ${matching.length}).`);

    const { rollItem } = require('../../core/gachaEngine');
    const remaining = [...user.inventory];
    for (let i = 0; i < 3; i++) remaining.splice(remaining.indexOf(matching[i]), 1);

    const upgraded = rollItem();
    remaining.push(`${upgraded.emoji} ${upgraded.name}`);
    saveUser(id, { inventory: remaining });
    await ctx.reply(`✨ Upgraded 3x ${config.gacha.rarities[idx].label} into: ${upgraded.emoji} ${upgraded.name} [${upgraded.label}]`);
  },
};
