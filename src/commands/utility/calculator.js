module.exports = {
  name: 'calculator',
  description: 'Evaluate a math expression — /calculator 2+2*5',
  execute: async (ctx) => {
    const expr = ctx.message.text.split(' ').slice(1).join(' ').trim();
    if (!expr) {
      await ctx.reply('❓ Usage: /calculator <expression>\nExample: /calculator (5+3)*2');
      return;
    }

    // Only allow safe characters — numbers, operators, parentheses, decimal points, spaces.
    if (!/^[0-9+\-*/().\s%]+$/.test(expr)) {
      await ctx.reply('❌ Only numbers and + - * / ( ) % are allowed.');
      return;
    }

    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${expr})`)();
      await ctx.reply(`🧮 ${expr} = *${result}*`, { parse_mode: 'Markdown' });
    } catch (_) {
      await ctx.reply('❌ Invalid expression.');
    }
  },
};
