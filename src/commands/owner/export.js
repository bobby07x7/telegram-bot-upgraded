const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'export',
  description: 'Export the full database as a JSON file',
  ownerOnly: true,
  execute: async (ctx) => {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(__dirname, '..', '..', '..', 'storage', 'db.json');
    if (!fs.existsSync(dbPath)) return ctx.reply('❌ No database file found yet.');
    await ctx.replyWithDocument({ source: dbPath, filename: `db-export-${Date.now()}.json` });
  },
};
