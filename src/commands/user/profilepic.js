// Alias of /avatar, kept as a separate command per the requested command list.
const avatarCommand = require('./avatar');

module.exports = {
  name: 'profilepic',
  description: 'Alias for /avatar',
  execute: avatarCommand.execute,
};
