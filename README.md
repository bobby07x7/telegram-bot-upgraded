# Telegram Bot — Upgraded (v2)

A modernized, modular Telegram bot: animated inline-button UI, engaging
menus, auto-loaded commands, and a real permission wall — owner/admin
commands are **completely invisible** to normal users, not just
"access denied."

Rebuilt on top of the same one-file-per-command architecture as the
original, so it's still trivial to extend: drop a file in a category
folder and it's live.

## What's new in this upgrade

- 🎨 **Redesigned core UI** (`src/core/uiHelper.js`) — themeable icons,
  card-style formatted messages, progress bars, inline keyboards
- 🎬 **Real animations** — loading spinners, an animated `/ping` that
  fills a progress bar in real time, a `/fight` exchange-of-blows
  animation, animated `/slots` reels, animated `/spin` (gacha)
- 🙈 **Hidden owner/admin layer** — the "owner" category and any
  command flagged `ownerOnly`/`adminOnly` never appear in `/start`,
  `/help`, or category menus for normal users — they simply don't
  exist from a normal user's point of view
- 🧭 **Interactive menu system** — `/start` opens a button-driven menu;
  every category (Economy, Gacha, Games, Fun, Group, Security,
  Utility, Media, + hidden Owner) is one tap away, with back/close
  navigation on every screen
- 🔄 **Hot reload** — `/reload` (owner only) picks up new/edited
  command files without restarting the process

## Setup

```bash
npm install
cp .env.example .env
# fill in BOT_TOKEN and OWNER_ID at minimum
npm start
```

Required:
- `BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
- `OWNER_ID` — your numeric Telegram ID, from [@userinfobot](https://t.me/userinfobot)

Everything else in `.env.example` is optional.

## Included commands (starter set)

This upgrade ships with a working, representative command in every
category so you can see the new UI/animation patterns end to end.
Add more commands the same way as before — one file, auto-loaded.

| Category | Commands included |
|---|---|
| user | `/start`, `/help`, `/profile`, `/daily` |
| economy | `/balance`, `/bank` (+ deposit/withdraw buttons) |
| gacha | `/spin` (animated roll, weighted rarities) |
| games | `/fight` (animated), `/slots` (animated reels) |
| fun | `/8ball` |
| group | `/ban` (real Telegram moderation, admin-gated) |
| security | `/antispam` (per-group toggle) |
| media | `/meme` (works with no API key) |
| owner *(hidden)* | `/panel`, `/broadcast`, `/maintenance` |

## Adding a new command

```js
// src/commands/fun/newcommand.js
module.exports = {
  name: 'newcommand',
  description: 'What this does',
  ownerOnly: false,   // true = hidden from & unusable by normal users
  execute: async (ctx, { config, logger, commandLoader }) => {
    await ctx.reply('Hello!');
  },
};
```

For a styled reply, use the UI helpers instead of plain `ctx.reply`:

```js
const { card } = require('../../core/uiHelper');
await ctx.reply(card({ icon: '✨', title: 'Title', lines: ['line 1', 'line 2'] }), { parse_mode: 'Markdown' });
```

Run `/reload` (as owner) or restart — it's live, and `/help` picks it
up automatically, filtered by who's allowed to see it.

## Adding a new inline button

Create a file in `src/actions/`, exporting `{ pattern, handle }` — see
`src/actions/menu.js` or `src/actions/bank.js` for the pattern.

## Project structure

```
telegram-bot/
├── app.js
├── src/
│   ├── config/config.js
│   ├── core/
│   │   ├── logger.js
│   │   ├── commandLoader.js
│   │   ├── actionLoader.js
│   │   ├── errorHandler.js
│   │   ├── uiHelper.js        ← animations, keyboards, card formatting
│   │   └── menuContent.js     ← /start + /help, permission filtering
│   ├── commands/<category>/<command>.js
│   ├── actions/*.js
│   └── database/
│       ├── store.js           ← users & groups (JSON-file)
│       └── botState.js        ← maintenance mode, runtime flags
└── storage/
    ├── db.json                (git-ignored)
    └── state.json             (git-ignored)
```

## Deploy

```bash
npm install --production
npm start
```

Recommended: [PM2](https://pm2.keymetrics.io/)

```bash
npm install -g pm2
pm2 start app.js --name telegram-bot
```

## Push to your own repo

```bash
git init
git add .
git commit -m "Upgraded bot: animated UI, hidden owner commands, new menu system"
git branch -M main
git remote add origin <your-new-repo-url>
git push -u origin main
```
