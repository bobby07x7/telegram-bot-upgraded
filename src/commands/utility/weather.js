const fetch = require('node-fetch');

module.exports = {
  name: 'weather',
  description: 'Get current weather — /weather <city>',
  execute: async (ctx) => {
    const city = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!city) {
      await ctx.reply('❓ Usage: /weather <city name>');
      return;
    }

    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
    const geo = await geoRes.json();

    if (!geo.results || !geo.results.length) {
      await ctx.reply(`❌ City "${city}" not found.`);
      return;
    }

    const { latitude, longitude, name, country } = geo.results[0];
    const wRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
    const w = await wRes.json();
    const cw = w.current_weather;

    await ctx.reply(
      `🌤️ *Weather in ${name}, ${country}*\n\n` +
      `🌡️ Temperature: ${cw.temperature}°C\n` +
      `💨 Wind: ${cw.windspeed} km/h\n` +
      `🕐 Updated: ${cw.time}`,
      { parse_mode: 'Markdown' }
    );
  },
};
