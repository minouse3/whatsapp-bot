module.exports = {
  apps: [
    {
      name: "whatsapp-bot",
      script: "./index.js",
      watch: false,        // false supaya tidak restart tiap file berubah
      autorestart: true,   // restart otomatis kalau crash
      max_restarts: 10,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};