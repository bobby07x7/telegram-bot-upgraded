const media = require('../../services/mediaService');

function getArg(ctx) {
  return ctx.message.text.split(' ').slice(1).join(' ').trim();
}

module.exports = {
  name: 'song',
  description: 'Alias for /music — search and download a song by name',
  execute: async (ctx, extras) => extras.commands.get('music').execute(ctx, extras),
};
