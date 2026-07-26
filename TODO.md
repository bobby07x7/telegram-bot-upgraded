4
# TODO - New Bot (Owner Add)

- [ ] Inspect existing state persistence (src/database/botState.js) and decide where to store extra bot tokens/users.
- [ ] Add owner command: /addbot <BOT_TOKEN> [BOT_NAME] to save token in state.
- [ ] Modify app.js bootstrap to start multiple Telegraf instances (main + saved tokens), each with same command/action loader.
- [ ] Add /bots command to list configured bots (with safe token masking).
- [ ] Add /removebot <BOT_TOKEN_OR_INDEX> to delete a bot token.
- [ ] Ensure owner/admin check works across bots (ownerId/extraAdmins shared in state).
- [x] Restart/testing: node app.js and verify each added bot responds to /start.


