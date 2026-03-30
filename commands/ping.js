module.exports = {
    name: "ping",
    description: "Check bot uptime",

    async execute(client, msg) {
        // uptime in seconds
        const uptime = process.uptime();

        // format uptime
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

        const reply = `🏓 Pong!\n` + `⏱ Uptime: ${uptimeFormatted}`
        
        await msg.reply(reply);

        return reply; // return it for logging
    }
};