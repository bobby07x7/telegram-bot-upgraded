const fetch = require('node-fetch');

const LANG_CODES = {
  english: 'en', hindi: 'hi', spanish: 'es', french: 'fr', german: 'de',
  arabic: 'ar', japanese: 'ja', korean: 'ko', chinese: 'zh', russian: 'ru',
  portuguese: 'pt', italian: 'it', indonesian: 'id', urdu: 'ur',
};

module.exports = {
  name: 'translatefile',
  description: 'Translate a .txt file — reply to it with /translatefile <lang>',
  execute: async (ctx) => {
    const doc = ctx.message.reply_to_message?.document;
    const targetLangRaw = (ctx.message.text.split(' ').slice(1).join(' ').trim() || 'english').toLowerCase();
    const targetLang = LANG_CODES[targetLangRaw] || targetLangRaw;

    if (!doc) {
      await ctx.reply('❓ Reply to a .txt file with /translatefile <target language>.');
      return;
    }
    if (!doc.file_name?.endsWith('.txt')) {
      await ctx.reply('❌ Only plain .txt files are supported right now.');
      return;
    }

    await ctx.sendChatAction('typing');
    const fileLink = await ctx.telegram.getFileLink(doc.file_id);
    const res = await fetch(fileLink.href);
    const content = (await res.text()).slice(0, 490); // free API has a ~500 char limit per request

    try {
      const apiRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(content)}&langpair=en|${targetLang}`
      );
      const data = await apiRes.json();
      const translated = data?.responseData?.translatedText || 'Translation failed.';
      await ctx.reply(`🌐 *Translated to ${targetLangRaw}:*\n\n${translated}\n\n_(Free tier: first ~490 characters only)_`, { parse_mode: 'Markdown' });
    } catch (err) {
      await ctx.reply(`❌ Translation service error: ${err.message}`);
    }
  },
};

