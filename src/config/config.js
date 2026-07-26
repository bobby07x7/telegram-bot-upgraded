require('dotenv').config();

module.exports = {
  botToken: process.env.BOT_TOKEN,
  ownerId: process.env.OWNER_ID,
  botAdmins: (process.env.BOT_ADMINS || '').split(',').map((s) => s.trim()).filter(Boolean),
  botName: process.env.BOT_NAME || 'Bot',

  SUPPORT_GROUP_URL: process.env.SUPPORT_GROUP_URL || 'https://t.me',
  SUPPORT_CHANNEL_URL: process.env.SUPPORT_CHANNEL_URL || 'https://t.me',
  DEVELOPER_URL: process.env.DEVELOPER_URL || 'https://t.me',
  ADD_TO_GROUP_URL: process.env.ADD_TO_GROUP_URL || 'https://t.me',

  MEDIA_API_BASE_URL: process.env.MEDIA_API_BASE_URL || '',
  MEDIA_API_KEY: process.env.MEDIA_API_KEY || '',
  NEWS_API_KEY: process.env.NEWS_API_KEY || '',

  economy: {
    startingBalance: 500,
    dailyReward: 200,
    weeklyReward: 1000,
  },

  maintenanceMode: false,
};
