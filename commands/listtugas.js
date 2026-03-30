const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

module.exports = {
    name: "listtugas",
    description: "Menampilkan semua tugas yang sudah ditambahkan",

    async execute(client, msg) {
        const filePath = path.join(__dirname, "../assets/assignment.json");

        if (!fs.existsSync(filePath)) {
            const reply = "Belum ada tugas yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        let assignments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        if (assignments.length === 0) {
            const reply = "Belum ada tugas yang ditambahkan.";
            await msg.reply(reply);
            return reply;
        }

        const now = dayjs();
        assignments = assignments.filter(t => dayjs(t.deadline).isAfter(now));

        let reply = "*📋 Daftar Tugas:*\n\n";
        assignments.forEach((tugas, index) => {
            const deadlineLocal = dayjs(tugas.deadline).format("DD/MM/YYYY HH:mm");
            const keteranganText = tugas.keterangan
                .map(line => `- ${line}`)  // tanda "-" rapih
                .join("\n");

            reply += `*${index + 1}.* ${tugas.title}\n` +
                     `*Deadline:* ${deadlineLocal}\n` +
                     `*Pengumpulan:* ${tugas.pengumpulan}\n` +
                     `*Keterangan:*\n${keteranganText || "-"}\n\n`;
        });

        await msg.reply(reply);
        return reply;
    }
};