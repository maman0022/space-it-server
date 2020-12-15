module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL
    || 'postgresql://postgres@localhost/spaced-repetition',
  JWT_SECRET: process.env.JWT_SECRET || 'HGTRtFghfhgu87979898tgG^&%$#@#4eTYFfyggftfy',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '3h',
}
