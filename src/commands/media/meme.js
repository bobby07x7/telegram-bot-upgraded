const axios = require('axios');

module.exports = {
  name: 'meme',
  description: 'Get a random meme',
  category: 'media',
  ownerOnly: false,
  execute: async (ctx) => {
    try {
      const { data } = await axios.get('https://meme-api.com/gimme');
      await ctx.replyWithPhoto(data.url, { caption: `😂 ${data.title}` });
    } catch (err) {
      await ctx.reply('❌ Could not fetch a meme right now, try again later.');
    }
  },
};
