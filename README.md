# Telegram Bot

A modular Node.js Telegram bot — **209 commands across 10 categories**, each command in its own file, fully auto-loaded. Stylish inline-button UI with a loading animation. No AI dependency — everything below runs on plain logic + a local JSON store.

## Features

- 📁 **One file per command** — organized into category folders (`src/commands/<category>/<command>.js`)
- 🔌 **Auto command loader** — drop a file in, it registers itself. No manual wiring, ever.
- 🎛️ **Inline button system** — `/start` menu, paginated `/help`, and per-category views, all with a loading animation
- 💰 **Full economy system** — wallet, bank, loans, shop, trading, auctions (JSON-file backed)
- 🎲 **Gacha system** — spins, rarities, collections, upgrades
- 👥 **Real group moderation** — ban/kick/mute/warn/lock use the actual Telegram Bot API
- 🛡️ **Security toggles** — anti-spam/flood/link/raid settings per group, blacklist/whitelist, filters
- 🎮 **20 mini-games** — dice, slots, blackjack, tic-tac-toe, hangman, wordle, simplified chess, and more
- 👑 **Owner control panel** — broadcast, maintenance mode, feature flags, admin management, backups
- 📝 **Winston logging**, graceful error handling, hot-reload without restart

## Setup

```bash
npm install
cp .env.example .env
# fill in BOT_TOKEN, OWNER_ID, and the UI links
npm start
```

Required:
- `BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
- `OWNER_ID` — your numeric Telegram ID (get it from [@userinfobot](https://t.me/userinfobot))

Optional (log group — bot posts startup/new-user/error logs here):
- `LOG_GROUP_ID` — a supergroup/channel id (starts with `-100...`). Add the bot to that group **as an admin** first, otherwise log posts will silently fail (a warning is written to the local log file, nothing crashes). Defaults to `-1003666356509` if not set.

Optional (used by the `/start` menu buttons):
- `BOT_NAME`, `SUPPORT_GROUP_URL`, `SUPPORT_CHANNEL_URL`, `DEVELOPER_URL`, `ADD_TO_GROUP_URL`

Optional (only needed for specific commands):
- `MEDIA_API_BASE_URL` / `MEDIA_API_KEY` — see **Media downloads**, below
- `NEWS_API_KEY` — for `/news`

## Adding a new command

Create a new file in the right category folder, e.g. `src/commands/fun/newcommand.js`:

```js
module.exports = {
  name: 'newcommand',
  description: 'What this command does',
  ownerOnly: false,          // true = only owner/bot-admins can run it
  execute: async (ctx, { config, logger, commands }) => {
    await ctx.reply('Hello!');
  },
};
```

Restart (or run `/reload` as the owner) — it's live. The category is inferred automatically from the folder name, so `/help` picks it up too. No other file needs to change.

Adding a new inline button works the same way in `src/actions/` — see any file there for the pattern.

## Project Structure

```
telegram-bot/
├── app.js                     Entry point — bot bootstrap
├── src/
│   ├── config/config.js       All settings in one place
│   ├── core/
│   │   ├── logger.js          Winston logger
│   │   ├── commandLoader.js   Auto-loads src/commands/**/*.js
│   │   ├── actionLoader.js    Auto-loads src/actions/*.js (inline buttons)
│   │   ├── errorHandler.js    Global + per-command error safety net
│   │   ├── uiHelper.js        Loading animation + inline keyboards
│   │   ├── menuContent.js     Start/help text builders
│   │   ├── gachaEngine.js     Gacha roll logic
│   │   ├── cardEngine.js      Card game logic (blackjack/poker)
│   │   └── *Sessions.js       In-memory game session state
│   ├── commands/
│   │   ├── user/              20 - profile, balance, daily/weekly/monthly, etc.
│   │   ├── economy/           25 - bank, shop, trade, auction, etc.
│   │   ├── gacha/             20 - spin, upgrade, collection, etc.
│   │   ├── media/             20 - downloaders (see note below)
│   │   ├── group/             25 - ban/kick/mute/pin/welcome, etc.
│   │   ├── security/          20 - anti-spam/flood/link toggles, filters
│   │   ├── utility/           20 - ping, calculator, qr, weather, etc.
│   │   ├── games/             20 - dice, slots, blackjack, wordle, etc.
│   │   ├── fun/                19 - jokes, roasts, 8ball, etc.
│   │   └── owner/               20 - broadcast, maintenance, admin tools
│   ├── actions/                Inline button (callback_query) handlers
│   ├── database/
│   │   ├── store.js            JSON-file user/group data store
│   │   └── botState.js         Runtime state (maintenance, admins, flags)
│   └── services/
│       └── mediaService.js     Single integration point for media downloads
└── storage/
    ├── db.json                 User + group data (git-ignored)
    └── state.json              Bot runtime state (git-ignored)
```

## ⚠️ Media downloads need one thing from you

`/youtube`, `/tiktok`, `/spotify`, `/instagram`, `/facebook`, `/twitter`, `/music` etc. all call into **one file**: `src/services/mediaService.js`. Actually downloading from these platforms requires a third-party API — most are paid or rate-limited free tiers (e.g. a RapidAPI "social downloader" endpoint, or self-hosted `yt-dlp` behind a small HTTP wrapper).

Since this can't be verified or tested from a sandboxed build environment, that file ships as a clean, working integration point rather than a guessed-at scraper. Once you:
1. Pick a downloader API provider
2. Set `MEDIA_API_BASE_URL` and `MEDIA_API_KEY` in `.env`

...all 20 media commands work without touching any other file. `/meme` already works out of the box (uses the free `meme-api.com`, no key needed).

## ⚠️ A few commands are honestly simplified

- **`/chess`, `/ludo`, `/poker`** — playable, simplified versions (noted in-file comments). Full rule-perfect implementations (legal-move validation, multiplayer boards) are out of scope for a single command file — swap in a library like `chess.js` if you need tournament-legal chess.
- **`/sticker`, `/textsticker`, `/compress`, `/resize`, `/watermark`, `/convert`, `/enhance`** — these need an image-processing library (`sharp` or `ffmpeg`) that isn't installed by default. Each file has a clear comment showing exactly where to wire it in.
- Three command names were renamed to avoid collisions with an identical name in another category: gacha's `/history` -> **`/gachahistory`**, gacha's `/redeem` -> **`/gacharedeem`**, gacha's `/luck` -> **`/luckcheck`**.

Everything else — economy, gacha mechanics, group moderation, security toggles, owner tools, utility, and most games — is fully functional out of the box.

## Git

```bash
git init
git add .
git commit -m "Initial bot"
```

`.env`, `node_modules/`, and `storage/db.json` / `storage/state.json` are already git-ignored.

## Deploy (production)

```bash
npm install --production
npm start
```

Recommended process manager: [PM2](https://pm2.keymetrics.io/)
```bash
npm install -g pm2
pm2 start app.js --name telegram-bot
```
