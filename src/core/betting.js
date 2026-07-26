const { config } = require('../config/config');

/**
 * Validates a bet amount against the user's balance.
 * Returns null if valid, or an error string to show the user.
 */
function validateBet(amount, balance) {
  if (!amount || isNaN(amount) || amount <= 0) return 'Enter a valid bet amount greater than 0.';
  if (!Number.isInteger(amount)) return 'Bet amount must be a whole number.';
  if (amount > balance) return `You only have ${balance}${config.economy.currencySymbol} — that bet is too high.`;
  return null;
}

/**
 * Builds a consistent bordered win/lose result card for gambling games.
 */
function buildBetResultCard({ title, lines, won, delta }) {
  const { currencySymbol } = config.economy;
  const outcome = won
    ? `🎉 *YOU WON* +${Math.abs(delta)}${currencySymbol}`
    : delta === 0
      ? `➖ *PUSH* — bet returned`
      : `😔 *YOU LOST* -${Math.abs(delta)}${currencySymbol}`;

  return (
    `╔═══════ ${title} ═══════╗\n` +
    `║\n` +
    lines.map((l) => `║  ${l}`).join('\n') +
    `\n║\n` +
    `║  ${outcome}\n` +
    `╚══════════════════════════╝`
  );
}

module.exports = { validateBet, buildBetResultCard };
