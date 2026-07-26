module.exports = {
  id: /^quiz:(correct|wrong)$/,
  handler: async (ctx) => {
    const result = ctx.match[1];
    await ctx.answerCbQuery(result === 'correct' ? '✅ Correct!' : '❌ Wrong!');
    await ctx.editMessageText(`${ctx.callbackQuery.message.text}\n\n${result === 'correct' ? '✅ Correct answer!' : '❌ Wrong answer.'}`);
  },
};
