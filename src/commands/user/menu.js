// /menu is just a friendly alias for /help
const helpCommand = require('./help');

module.exports = {
  name: 'menu',
  description: 'Alias for /help — opens the command menu',
  execute: helpCommand.execute,
};
