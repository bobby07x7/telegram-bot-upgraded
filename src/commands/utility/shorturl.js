const fetch = require('node-fetch');

module.exports = {
  name: 'shorturl',
  description: 'Shorten a URL — /shorturl <url>',
  execute: async (ctx) => {
    const url = ctx.message.text.split(' ')[1];
    if (!url || !/^https?:\/\//.test(url)) {
      await ctx.reply('❓ Usage: /shorturl https://example.com');
      return;
    }
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    const short = await res.text();
    await ctx.reply(`🔗 Shortened: ${short}`);
  },
};
