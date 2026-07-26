const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'update',
  description: 'View bot version / update info',
  ownerOnly: true,
  execute: async (ctx) => {
    const pkg = require('../../../package.json');
    await ctx.reply(`📦 ${pkg.name} v${pkg.version}\n\nPull the latest code from git and run "npm install && /restart" to update.`);
  },
};
