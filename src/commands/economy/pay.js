const { getUser, saveUser, addHistory } = require('../../database/store');
const { config } = require('../../config/config');

module.exports = {
  name: 'pay',
  description: 'Alias for /send — pay coins to a user (reply to their message)',
  execute: async (ctx, extras) => {
    const sendCmd = extras.commands.get('send');
    return sendCmd.execute(ctx, extras);
  },
};
