const DARES = [
  "Send the last photo in your gallery to this chat.",
  "Text a random contact 'I know what you did.'",
  "Speak in an accent for the next 3 messages.",
  "Change your profile picture to something silly for 10 minutes.",
  "Message the group your most-used emoji, 10 times.",
];

module.exports = {
  name: 'dare',
  description: 'Get a random dare',
  execute: async (ctx) => {
    await ctx.reply(`😈 Dare: ${DARES[Math.floor(Math.random() * DARES.length)]}`);
  },
};
