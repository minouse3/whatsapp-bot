const fs = require("fs");
const path = require("path");

module.exports = {
    name: "komting",
    description: "List komting mata kuliah",

    async execute(client, msg) {
        const filePath = path.join(__dirname, "../assets/komting.json");

        if (!fs.existsSync(filePath)) {
            const reply = "Belum ada komting yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

        if (data.length === 0) {
            const reply = "Belum ada komting yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        let reply = "*Daftar Komting:*\n\n";

        data.forEach((item, index) => {
            const matkulText = item.matkul
                .map(m => `- ${m}`)
                .join("\n");

            reply += `*${index + 1}. ${item.nama}*\n` +
                     `*No. HP:* ${item.noHP}\n` +
                     `*Mata Kuliah:*\n${matkulText}\n\n`;
        });

        await msg.reply(reply);
        return reply;
    }
};