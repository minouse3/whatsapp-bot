const fs = require("fs");
const path = require("path");

module.exports = {
    name: "hapustugas",
    description: "Hapus tugas: 1, beberapa (pisahkan koma), atau semua (!hapustugas all)",

    async execute(client, msg, args) {
        const filePath = path.join(__dirname, "../assets/assignment.json");
        if (!fs.existsSync(filePath)) {
            const reply = "ℹ️ Belum ada tugas yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        let assignments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (assignments.length === 0) {
            const reply = "ℹ️ Belum ada tugas yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        if (!args.length) {
            const reply = "❌ Gunakan: !hapustugas [nomor] atau !hapustugas [1,3,5] atau !hapustugas all";
            await msg.reply(reply);
            return reply;
        }

        const arg = args[0].toLowerCase();

        if (arg === "all") {
            const count = assignments.length;
            assignments = [];
            fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));
            const reply = `✅ Semua tugas (${count}) berhasil dihapus.`;
            await msg.reply(reply);
            return reply;
        }

        // Hapus batch: pisahkan koma
        const indexes = arg.split(",").map(n => parseInt(n.trim(), 10) - 1).filter(n => !isNaN(n));
        if (indexes.length === 0) {
            const reply = "❌ Nomor tugas tidak valid.";
            await msg.reply(reply);
            return reply;
        }

        // Hapus dari belakang supaya index tetap aman
        indexes.sort((a, b) => b - a);

        let removedTitles = [];
        for (let i of indexes) {
            if (i >= 0 && i < assignments.length) {
                removedTitles.push(assignments[i].title);
                assignments.splice(i, 1);
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));

        const reply = `✅ Tugas berhasil dihapus:\n${removedTitles.map(t => `- ${t}`).join("\n")}`;
        await msg.reply(reply);
        return reply;
    }
};