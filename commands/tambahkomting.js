const fs = require("fs");
const path = require("path");

module.exports = {
    name: "tambahkomting",
    description: "Format: NamaKomting;NoHP;Matkul1,Matkul2,etc",

    async execute(client, msg, args) {
        if (args.length === 0) {
            const reply = "❌ Format salah!\nGunakan: NamaKomting;NoHP;Matkul1,Matkul2,etc";
            await msg.reply(reply);
            return reply;
        }

        const input = args.join(" ").trim();

        // Split berdasarkan ";"
        const parts = input.split(";").map(p => p.trim());

        if (parts.length < 3) {
            const reply = "❌ Format kurang lengkap!\nHarus ada: NamaKomting;NoHP;Matkul1,Matkul2,etc";
            await msg.reply(reply);
            return reply;
        }

        const [nama, noHP, matkulStr] = parts;

        // Validasi No HP
        if (!/^\d+$/.test(noHP)) {
            const reply = "❌ No HP harus berupa angka saja!";
            await msg.reply(reply);
            return reply;
        }

        // Parsing matkul
        const matkul = matkulStr
            .split(",")
            .map(m => m.trim())
            .filter(m => m.length > 0);

        if (matkul.length === 0) {
            const reply = "❌ Minimal harus ada 1 mata kuliah.";
            await msg.reply(reply);
            return reply;
        }

        const filePath = path.join(__dirname, "../assets/komting.json");
        let data = [];

        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }

        const newKomting = {
            nama,
            noHP,
            matkul,
            addedBy: msg.from.replace("@c.us", ""),
            timestamp: new Date().toISOString()
        };

        data.push(newKomting);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        const matkulText = matkul.map(m => `- ${m}`).join("\n");

        const reply = `✅ *Komting Ditambahkan!*\n\n` +
                      `*Nama:* ${nama}\n` +
                      `*No. HP:* ${noHP}\n` +
                      `*Mata Kuliah:*\n${matkulText}`;

        await msg.reply(reply);
        return reply;
    }
};