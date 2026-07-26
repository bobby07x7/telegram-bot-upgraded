// Requires a free NewsAPI.org key to be fully functional.
module.exports = {
  name: 'news',
  description: 'Get top news headlines (requires NEWS_API_KEY)',
  execute: async (ctx) => {
    if (!process.env.NEWS_API_KEY) {
      await ctx.reply(
        '⚠️ This feature needs a free API key.\n\n' +
        '1. Get one at https://newsapi.org/register\n' +
        '2. Add NEWS_API_KEY=your_key to your .env file\n' +
        '3. Restart the bot'
      );
      return;
    }
    const fetch = require('node-fetch');
    const res = await fetch(`https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`);
    const data = await res.json();
    const lines = (data.articles || []).map((a, i) => `${i + 1}. ${a.title}`);
    await ctx.reply(`📰 *Top Headlines*\n\n${lines.join('\n\n') || 'No articles found.'}`, { parse_mode: 'Markdown' });
  },
};
