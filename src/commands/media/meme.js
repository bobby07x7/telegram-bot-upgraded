const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'meme',
  description: 'Get a random meme image (Reddit-sourced)',
  execute: async (ctx) => {
    const fetch = require('node-fetch');
    try {
      const res = await fetch('https://meme-api.com/gimme');
      const data = await res.json();
      await ctx.replyWithPhoto(data.url, { caption: data.title });
    } catch (err) {
      await ctx.reply('❌ Could not fetch a meme right now, try again later.');
    }
  },
};
