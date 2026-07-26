module.exports = {
  name: 'ping',
  description: 'Check bot response speed',
  execute: async (ctx) => {
    const start = Date.now();
    const sent = await ctx.reply('🏓 Pinging...');
    const latency = Date.now() - start;
    await ctx.telegram.editMessageText(sent.chat.id, sent.message_id, undefined, `🏓 Pong! Latency: ${latency}ms`);
  },
};
