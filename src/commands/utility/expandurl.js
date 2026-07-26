const fetch = require('node-fetch');

module.exports = {
  name: 'expandurl',
  description: 'Expand a shortened URL — /expandurl <url>',
  execute: async (ctx) => {
    const url = ctx.message.text.split(' ')[1];
    if (!url || !/^https?:\/\//.test(url)) {
      await ctx.reply('❓ Usage: /expandurl https://short.link/abc');
      return;
    }
    try {
      const res = await fetch(url, { redirect: 'follow' });
      await ctx.reply(`🔗 Final URL: ${res.url}`);
    } catch (err) {
      await ctx.reply('❌ Could not resolve that URL.');
    }
  },
};
