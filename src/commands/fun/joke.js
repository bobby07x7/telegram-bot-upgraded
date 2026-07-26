const JOKES = [
  "Why don't programmers like nature? It has too many bugs.",
  "I told my computer I needed a break, and now it won't stop sending me KitKat ads.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "There are 10 types of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
];

module.exports = {
  name: 'joke',
  description: 'Get a random joke',
  execute: async (ctx) => {
    await ctx.reply(`😂 ${JOKES[Math.floor(Math.random() * JOKES.length)]}`);
  },
};
