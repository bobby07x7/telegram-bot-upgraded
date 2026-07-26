module.exports = {
  name: 'utilprofilepic',
  description: "Fetch a user's profile picture by replying to them",
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from || ctx.from;
    const photos = await ctx.telegram.getUserProfilePhotos(target.id, 0, 1);
    if (!photos.total_count) {
      await ctx.reply('❌ No profile photo found.');
      return;
    }
    const fileId = photos.photos[0][photos.photos[0].length - 1].file_id;
    await ctx.replyWithPhoto(fileId);
  },
};
