const ROASTS = [
  "You bring everyone so much joy... when you leave the room.",
  "I'd explain it to you, but I left my crayons at home.",
  "You're the reason the gene pool needs a lifeguard.",
  "I'm not saying you're slow, but you'd lose a race to a sloth.",
  "You have something on your chin... no, the third one down.",
];

module.exports = {
  name: 'roast',
  description: 'Get roasted (all in good fun)',
  execute: async (ctx) => {
    const target = ctx.message.reply_to_message?.from?.first_name;
    const prefix = target ? `${target}, ` : '';
    await ctx.reply(`🔥 ${prefix}${ROASTS[Math.floor(Math.random() * ROASTS.length)]}`);
  },
};
