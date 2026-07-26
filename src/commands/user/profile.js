const { getUser } = require('../../database/store');
const { buildProfileText } = require('../../core/profileCard');
const { isOwnerOrAdmin } = require('../../core/permissions');

module.exports = {
  name: 'profile',
  description: "View your profile card (balance, level, gear, badges) with your Telegram profile photo",
  execute: async (ctx) => {
    const user = getUser(ctx.from.id);
    const isGod = isOwnerOrAdmin(ctx.from.id);
    const text = buildProfileText(ctx.from.first_name, user, { isGod });

    // Try to attach the user's own Telegram profile photo so /profile feels
    // like a real character card. Falls back to plain text if they have none
    // or the lookup fails for any reason.
    let photoFileId = null;
    try {
      const photos = await ctx.telegram.getUserProfilePhotos(ctx.from.id, 0, 1);
      if (photos.total_count > 0) {
        const sizes = photos.photos[0];
        photoFileId = sizes[sizes.length - 1].file_id; // largest resolution
      }
    } catch (err) {
      // ignore — just fall back to text-only profile below
    }

    if (photoFileId) {
      await ctx.replyWithPhoto(photoFileId, { caption: text, parse_mode: 'Markdown' });
    } else {
      await ctx.reply(text, { parse_mode: 'Markdown' });
    }
  },
};
