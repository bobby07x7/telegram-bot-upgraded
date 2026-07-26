# Upgrade Notes — Engine & UI Pass

This pass focused on the **core framework** (so every one of the 200+ commands
benefits automatically) plus a full rebuild of the combat/PvP commands as a
showcase of the new animation system. It intentionally did **not** touch all
200+ command files individually — that would mean unreviewed, untested
changes across the whole codebase. Instead:

## 1. New shared UI engine (`src/core/uiHelper.js`)
- `buildHpBar(hp, max)` — one HP-bar renderer used everywhere (was duplicated
  ad-hoc in `fight.js`). Auto color-shifts 🟩 → 🟨 → 🟥 as HP drops.
- `showTyping(ctx)` — fires Telegram's native "typing…" indicator.
- `playCombatAnimation(ctx, opts)` — cinematic combat reveal: VS intro card →
  round-by-round clash frames (with hit FX emoji + live HP bars) → final
  result card. The winner/log must already be decided before calling it —
  this only *reveals* the outcome, it never decides it (so no exploits).
- `playEliminationCinematic(ctx, opts)` — lighter suspense-frame reveal for
  non-HP PvP jokes (`/kill`, `/duel`).

Any new command (or existing one you want to upgrade later) can now call
these two functions to get the same polished animation for free — see
`fight.js`, `kill.js`, `duel.js` for the pattern.

## 2. Rebuilt commands
- **`/fight`** — now uses `playCombatAnimation`: VS intro, round-by-round
  reveal with live HP bars for both fighters, crit-hit callouts, cleaner
  final card. Game logic (damage, XP, leveling, bets, KO/recovery) is
  unchanged — only presentation was rebuilt.
- **`/kill`** — was a single flat message; now a 4-frame suspense build
  ("Locating target… → Loading weapon… → Taking aim… → Firing in 3,2,1")
  before the punchline reveal.
- **`/duel`** — same suspense-cinematic treatment ("Weapons drawn…" →
  "Circling…" → "Steel meets steel…" → reveal) instead of one instant reply.

## 3. Global "typing…" indicator (`app.js`)
Every command now fires Telegram's native typing indicator the instant it's
invoked, before the reply arrives — makes the bot feel responsive even
during the ~1-2s of DB/logic work, at zero cost to existing commands.

## 4. `/start` — rotating tips
The main menu now rotates one contextual tip each time it's opened
("Try /spin for a free daily pull", "Reply with /fight for a live PvP
brawl", etc.) so new users always have one concrete next action instead of
a static wall of text.

## Already in place (verified, not changed)
- Owner/admin commands were **already correctly hidden** from normal users:
  `menuContent.js` filters the `owner` category and any `ownerOnly` command
  out of `/help` and `/start` for non-owners, and `app.js` independently
  re-checks `ownerOnly` before executing — so even a guessed `/command` is
  blocked, not just hidden from the menu. This is defense-in-depth and was
  left untouched.

## Suggested next steps (not done in this pass, to keep changes reviewable)
- Apply `playCombatAnimation` / `playEliminationCinematic` to `/rob`,
  `/roast`, `/roulette`, `/race`, `/ludo` for the same cinematic feel.
- Add inline "🔁 Rematch" / "💰 Bet again" buttons under game result cards
  using the existing `src/actions/` pattern.
- Paginate `/help` categories with 15+ commands (e.g. `group`, `economy`)
  so long lists don't hit Telegram's message-length limit.
