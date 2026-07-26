module.exports = {
  name: 'emojiinfo',
  description: 'Get info about a custom emoji (reply to a message containing one)',
  execute: async (ctx) => {
    const entities = ctx.message.reply_to_message?.entities || ctx.message.entities || [];
    const customEmoji = entities.find((e) => e.type === 'custom_emoji');

    if (!customEmoji) {
      await ctx.reply('❌ No custom emoji found in that message.');
      return;
    }

    await ctx.reply(`🆔 Custom Emoji ID: \`${customEmoji.custom_emoji_id}\``, { parse_mode: 'Markdown' });
  },
};
