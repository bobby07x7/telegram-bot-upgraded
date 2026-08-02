const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');
const { findItem, displayName, upgradeCost, UPGRADE_MAX_LEVEL } = require('../../database/items');

const HAMMER_ID = 'forgehammer';

module.exports = {
  name: 'upgrade',
  description: 'Level up an owned weapon/armor/accessory with coins + Forge Hammers — /upgrade <item>',
  execute: async (ctx) => {
    const id = ctx.from.id;
    const query = (ctx.message.text.split(' ').slice(1).join(' ') || '').trim();
    const user = getUser(id);

    if (!query) {
      return ctx.reply(
        `Usage: /upgrade <item name or id>\n` +
          `Costs coins + 🔨✨ Forge Hammers (buy from /shop). Max level ${UPGRADE_MAX_LEVEL}.\n` +
          `Check /inventory for what you own.`
      );
    }

    const item = findItem(query);
    if (!item || !user.inventory.includes(item.id)) {
      return ctx.reply("❌ You don't own that item. Check /inventory.");
    }
    if (!item.slot || item.slot === 'consumable') {
      return ctx.reply(`❌ ${displayName(item)} can't be upgraded — only weapons, armor, and accessories can.`);
    }

    const upgrades = { ...(user.upgrades || {}) };
    const currentLevel = upgrades[item.id] || 0;
    const cost = upgradeCost(item, currentLevel);

    if (!cost) {
      return ctx.reply(`✨ ${displayName(item)} is already at max level (Lv.${UPGRADE_MAX_LEVEL})!`);
    }

    const hammerCount = user.inventory.filter((i) => i === HAMMER_ID).length;
    const missing = [];
    if (user.balance < cost.coins) missing.push(`${cost.coins - user.balance}${config.economy.currencySymbol}`);
    if (hammerCount < cost.hammers) missing.push(`${cost.hammers - hammerCount}x 🔨✨ Forge Hammer`);

    if (missing.length) {
      return ctx.reply(
        `❌ Not enough to upgrade ${displayName(item)} to Lv.${cost.nextLevel}.\n` +
          `Need: ${cost.coins}${config.economy.currencySymbol} + ${cost.hammers}x 🔨✨ Forge Hammer\n` +
          `You have: ${user.balance}${config.economy.currencySymbol}, ${hammerCount}x Forge Hammer\n` +
          `Still missing: ${missing.join(', ')}\n\n` +
          `Buy Forge Hammers with /buy ${HAMMER_ID}`
      );
    }

    // Consume exactly `cost.hammers` Forge Hammers from inventory.
    const newInventory = [...user.inventory];
    let toRemove = cost.hammers;
    for (let i = newInventory.length - 1; i >= 0 && toRemove > 0; i--) {
      if (newInventory[i] === HAMMER_ID) {
        newInventory.splice(i, 1);
        toRemove--;
      }
    }

    upgrades[item.id] = cost.nextLevel;

    saveUser(id, { balance: user.balance - cost.coins, inventory: newInventory, upgrades });
    addHistory(id, { type: 'upgrade', item: item.name, level: cost.nextLevel, amount: -cost.coins });

    const isMax = cost.nextLevel >= UPGRADE_MAX_LEVEL;
    await ctx.reply(
      `🔨✨ *Upgrade complete!*\n${displayName(item)} is now *Lv.${cost.nextLevel}*${isMax ? ' (MAX!)' : ''}\n` +
        `💰 -${cost.coins}${config.economy.currencySymbol} | 🔨✨ -${cost.hammers} Forge Hammer\n\n` +
        `${item.slot !== 'consumable' ? 'Equip it with /equip to bring the bonus into /fight.' : ''}`,
      { parse_mode: 'Markdown' }
    );
  },
};
