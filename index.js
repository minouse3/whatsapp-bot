const qrcode = require('qrcode-terminal')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const {LocalAuth, Client} = require('whatsapp-web.js')
const handleMessage = require('./handler')
require('./cron');

const whitelistPath = path.join(__dirname, "assets/whitelist.json");
let whitelist = [];
if (fs.existsSync(whitelistPath)) {
    whitelist = JSON.parse(fs.readFileSync(whitelistPath, "utf-8"));
} else {
    console.warn("⚠️ File whitelist.json tidak ditemukan, whitelist kosong.");
}

const client = new Client({
    authStrategy: new LocalAuth({clientId: 'Jamal'}),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
})

client.on('qr', qr => qrcode.generate(qr, {small:true}))

client.on('authenticated', () => console.log('Authenticating...'))

client.on('ready', async () => {
    console.log('LOGGED IN');

    const chats = await client.getChats();

    console.log('=== GROUP CHATS ===')
    const groups = chats.filter(chat => chat.isGroup)
    groups.forEach(group => {
        console.log('Group Name:', group.name)
        console.log('Group ID:', group.id._serialized)
        console.log('----------------------')
    });

    console.log('=== INDIVIDUAL CHATS ===')
    const individuals = chats.filter(chat => !chat.isGroup)
    individuals.forEach(chat => {
        console.log('Contact Name:', chat.name || chat.id.user) // fallback to number
        console.log('Contact ID:', chat.id._serialized)
        console.log('----------------------')
    });
});

client.on('message', async msg => {
    if(whitelist.includes(msg.from)){  
        await handleMessage(client, msg)
    }
})

client.initialize()
