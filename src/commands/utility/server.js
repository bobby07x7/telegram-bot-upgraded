const os = require('os');

module.exports = {
  name: 'server',
  description: 'View server hardware info',
  execute: async (ctx) => {
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    await ctx.reply(
      `🖥️ *Server Info*\n\n` +
      `Platform: ${os.platform()} ${os.arch()}\n` +
      `CPU cores: ${os.cpus().length}\n` +
      `RAM: ${(totalMem - freeMem).toFixed(2)}GB / ${totalMem}GB used\n` +
      `Node: ${process.version}`,
      { parse_mode: 'Markdown' }
    );
  },
};
