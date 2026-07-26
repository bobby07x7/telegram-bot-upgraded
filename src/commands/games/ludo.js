// Simplified single-player Ludo-style race: roll dice to move your token
// along a 30-tile track to the finish. (Full 4-player Ludo board is out of
// scope for a text bot — this keeps the core "roll & race" mechanic.)
const sessions = new Map();
const TRACK_LENGTH = 30;

module.exports = {
  name: 'ludo',
  description: 'Roll dice and race your token to the finish (tile 30)',
  execute: async (ctx) => {
    const chatId = ctx.chat.id;
    let session = sessions.get(chatId);

    if (!session) {
      session = { position: 0, rolls: 0 };
      sessions.set(chatId, session);
    }

    const roll = Math.floor(Math.random() * 6) + 1;
    session.position += roll;
    session.rolls++;

    if (session.position >= TRACK_LENGTH) {
      sessions.delete(chatId);
      await ctx.reply(`🎲 You rolled a ${roll}!\n🏁 You reached the finish in ${session.rolls} rolls! 🎉`);
      return;
    }

    const progress = Math.round((session.position / TRACK_LENGTH) * 10);
    const bar = '🟩'.repeat(progress) + '⬜'.repeat(10 - progress);
    await ctx.reply(`🎲 You rolled a ${roll}!\n${bar}\nPosition: ${session.position}/${TRACK_LENGTH} — roll again with /ludo`);
  },
};
