const fs = require("fs");
const path = require("path");

module.exports = {
    name: "hapuskomting",
    description: "Hapus komting: 1, beberapa (pisahkan koma), atau semua (!hapuskomting all)",

    async execute(client, msg, args) {
        const filePath = path.join(__dirname, "../assets/komting.json");
        if (!fs.existsSync(filePath)) {
            const reply = "ℹ️ Belum ada komting yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        let komting = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (komting.length === 0) {
            const reply = "ℹ️ Belum ada komting yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        if (!args.length) {
            const reply = "❌ Gunakan: !hapuskomting [nomor] atau !hapuskomting [1,3,5] atau !hapuskomting all";
            await msg.reply(reply);
            return reply;
        }

        const arg = args[0].toLowerCase();

        if (arg === "all") {
            const count = komting.length;
            komting = [];
            fs.writeFileSync(filePath, JSON.stringify(komting, null, 2));
            const reply = `✅ Semua komting (${count}) berhasil dihapus.`;
            await msg.reply(reply);
            return reply;
        }

        // Hapus batch: pisahkan koma
        const indexes = arg
            .split(",")
            .map(n => parseInt(n.trim(), 10) - 1)
            .filter(n => !isNaN(n));

        if (indexes.length === 0) {
            const reply = "❌ Nomor komting tidak valid.";
            await msg.reply(reply);
            return reply;
        }

        // Hapus dari belakang supaya index tetap aman
        indexes.sort((a, b) => b - a);

        let removedNames = [];
        for (let i of indexes) {
            if (i >= 0 && i < komting.length) {
                removedNames.push(komting[i].nama);
                komting.splice(i, 1);
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(komting, null, 2));

        const reply = `✅ Komting berhasil dihapus:\n${removedNames.map(n => `- ${n}`).join("\n")}`;
        await msg.reply(reply);
        return reply;
    }
};