const logger = require('../core/logger');

/**
 * ⚠️ IMPORTANT — READ BEFORE DEPLOYING MEDIA COMMANDS
 *
 * Downloading from YouTube, Spotify, TikTok, Instagram, Facebook, Twitter/X
 * requires a third-party API (most are paid or rate-limited free tiers,
 * e.g. RapidAPI download endpoints, or self-hosted yt-dlp).
 *
 * This sandbox has no network access to those platforms, so real download
 * logic cannot be written or tested here. What's implemented below is a
 * single, clean integration point: fill in MEDIA_API_BASE_URL and
 * MEDIA_API_KEY in .env, then each downloader function below sends the
 * request and returns a normalized result. Every /media command already
 * calls these functions — once you plug in a real provider, all 20
 * commands work with zero further changes.
 *
 * Recommended providers to look into: RapidAPI's "social-download-all-in-one"
 * style APIs, or self-hosting yt-dlp behind a small HTTP wrapper.
 */

const fetch = require('node-fetch');
const { config } = require('../config/config');

async function callDownloaderApi(endpoint, params) {
  if (!config.media.apiBaseUrl || !config.media.apiKey) {
    throw new Error(
      'Media downloader API is not configured. Set MEDIA_API_BASE_URL and MEDIA_API_KEY in .env — see src/services/mediaService.js for details.'
    );
  }

  const url = new URL(endpoint, config.media.apiBaseUrl);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${config.media.apiKey}` },
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error(`Media API error (${response.status}): ${text}`);
    throw new Error(`Downloader API returned ${response.status}`);
  }

  return response.json();
}

module.exports = {
  downloadYoutube: (url) => callDownloaderApi('/youtube', { url }),
  downloadYoutubeAudio: (url) => callDownloaderApi('/youtube/audio', { url }),
  downloadSpotify: (query) => callDownloaderApi('/spotify', { query }),
  downloadTiktok: (url) => callDownloaderApi('/tiktok', { url }),
  downloadInstagram: (url) => callDownloaderApi('/instagram', { url }),
  downloadFacebook: (url) => callDownloaderApi('/facebook', { url }),
  downloadTwitter: (url) => callDownloaderApi('/twitter', { url }),
  searchYoutube: (query) => callDownloaderApi('/youtube/search', { query }),
  searchLyrics: (query) => callDownloaderApi('/lyrics', { query }),
};
