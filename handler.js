const fs = require('fs');
const path = require('path');

const commands = new Map();
fs.readdirSync("./commands").forEach(file => {
    const cmd = require(`./commands/${file}`);
    commands.set(cmd.name, cmd);
});

// Baca chat ID untuk log
const logChatFile = path.join(__dirname, "assets/superadmin.json");
let logChatId = null;
if (fs.existsSync(logChatFile)) {
    const data = JSON.parse(fs.readFileSync(logChatFile, "utf-8"));
    logChatId = data.chatId;
}

module.exports = async (client, msg) => {
    const prefix = "!";
    const body = msg.body;

    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = commands.get(commandName);
    if (!command) return;

    try {
        const reply = await command.execute(client, msg, args);
        const contact = await msg.getContact();

        // Log ke console
        console.log(`Sender Number: ${contact.number}`);
        console.log(`Message: ${msg.body}`);
        console.log(`Reply: ${reply}`);

        // Kirim log ke private chat
        if (logChatId) {
            const logMessage = 
                `*Pesan Masuk*\n` +
                `*Dari:* ${contact.id.user || contact.number}\n` +  // fallback kalau lid
                `*Pesan:* ${msg.body}\n` +
                `*Reply:* ${reply}`;
            await client.sendMessage(logChatId, logMessage);
        }

    } catch (err) {
        console.error(err);
    }
};