const FACTS = [
  "Honey never spoils — archaeologists found 3000-year-old honey that was still edible.",
  "Octopuses have three hearts.",
  "Bananas are berries, but strawberries aren't.",
  "A day on Venus is longer than a year on Venus.",
  "Sharks existed before trees did.",
];

module.exports = {
  name: 'fact',
  description: 'Get a random fun fact',
  execute: async (ctx) => {
    await ctx.reply(`📚 Did you know? ${FACTS[Math.floor(Math.random() * FACTS.length)]}`);
  },
};
