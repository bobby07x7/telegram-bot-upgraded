module.exports = {
  name: 'stickerinfo',
  description: 'Get info about a sticker (reply to one)',
  execute: async (ctx) => {
    const sticker = ctx.message.reply_to_message?.sticker;
    if (!sticker) {
      await ctx.reply('❌ Reply to a sticker with /stickerinfo.');
      return;
    }
    await ctx.reply(
      `🏷️ *Sticker Info*\n\n` +
      `Emoji: ${sticker.emoji || 'N/A'}\n` +
      `Set: ${sticker.set_name || 'N/A'}\n` +
      `Size: ${sticker.width}x${sticker.height}\n` +
      `File ID: \`${sticker.file_id}\``,
      { parse_mode: 'Markdown' }
    );
  },
};
