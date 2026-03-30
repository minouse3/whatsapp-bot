const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = {
    name: "tambahtugas",
    description: "Tambah tugas baru. Gunakan ; untuk pisah Tugas, Deadline, Pengumpulan, Keterangan. Gunakan , untuk baris baru di keterangan.",

    async execute(client, msg, args) {
        if (args.length === 0) {
            const reply = "❌ Format salah! Gunakan: !tambahtugas Tugas;DD/MM/YYYY HH:MM;Pengumpulan;[Keterangan opsional]";
            await msg.reply(reply);
            return reply;
        }

        const input = args.join(" ");
        const parts = input.split(";").map(p => p.trim());

        if (parts.length < 3) {
            const reply = "❌ Minimal harus ada Tugas, Deadline, dan Pengumpulan.";
            await msg.reply(reply);
            return reply;
        }

        const [title, deadlineStr, pengumpulan] = parts;
        const keteranganRaw = parts[3] || "-";

        // parse deadline
        const dl = dayjs(deadlineStr, "DD/MM/YYYY HH:mm");
        if (!dl.isValid()) {
            const reply = "❌ Format tanggal salah! Gunakan DD/MM/YYYY HH:MM";
            await msg.reply(reply);
            return reply;
        }
        const deadlineISO = dl.toISOString();

        const keterangan = keteranganRaw.split(",").map(line => line.trim());

        const filePath = path.join(__dirname, "../assets/assignment.json");
        let assignments = [];
        if (fs.existsSync(filePath)) {
            assignments = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        }

        const newAssignment = {
            title,
            deadline: deadlineISO,
            pengumpulan,
            keterangan,
            addedBy: msg.from.replace("@c.us", ""),
            timestamp: new Date().toISOString()
        };

        assignments.push(newAssignment);
        fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));

        const keteranganText = keterangan
            .map(line => `- ${line}`)
            .join("\n");

        const reply = `✅ *Tugas Ditambahkan!*\n\n` +
                      `*Tugas:* ${title}\n` +
                      `*Deadline:* ${deadlineStr}\n` +
                      `*Pengumpulan:* ${pengumpulan}\n` +
                      `*Keterangan:*\n${keteranganText || "-"}`;

        await msg.reply(reply);
        return reply;
    }
};