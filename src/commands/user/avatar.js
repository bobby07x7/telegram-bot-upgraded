module.exports = {
  name: 'avatar',
  description: "View your (or a replied user's) profile photo",
  execute: async (ctx) => {
    const targetId = ctx.message.reply_to_message?.from?.id || ctx.from.id;
    const photos = await ctx.telegram.getUserProfilePhotos(targetId, 0, 1);

    if (!photos.total_count) {
      await ctx.reply('❌ No profile photo found for this user.');
      return;
    }

    const fileId = photos.photos[0][photos.photos[0].length - 1].file_id;
    await ctx.replyWithPhoto(fileId, { caption: '🖼️ Profile photo' });
  },
};
