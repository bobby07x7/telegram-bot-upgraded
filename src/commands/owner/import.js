const { getState, saveState } = require('../../database/botState');
const { getAllUserIds, getUser, saveUser } = require('../../database/store');

module.exports = {
  name: 'import',
  description: 'Import a database JSON file (reply to the file with /import)',
  ownerOnly: true,
  execute: async (ctx) => {
    const doc = ctx.message.reply_to_message?.document;
    if (!doc) return ctx.reply('↩️ Reply to a .json database export file with /import.');

    const fs = require('fs');
    const path = require('path');
    const fetch = require('node-fetch');

    const link = await ctx.telegram.getFileLink(doc.file_id);
    const res = await fetch(link.href);
    const text = await res.text();

    try {
      JSON.parse(text); // validate
      const dbPath = path.join(__dirname, '..', '..', '..', 'storage', 'db.json');
      fs.writeFileSync(dbPath, text);
      await ctx.reply('✅ Database imported successfully. Restart the bot to ensure a clean state.');
    } catch (err) {
      await ctx.reply(`❌ Invalid JSON file: ${err.message}`);
    }
  },
};
