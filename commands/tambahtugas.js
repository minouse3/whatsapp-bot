const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

module.exports = {
    name: "tambahtugas",
    description:
                "Contoh:\n" +
                "!tambahtugas\n" +
                "Judul tugas: Tugas Pemrograman 1\n" +
                "Deadline: 15/04/2026 17:00\n" +
                "Pengumpulan: Google Classroom\n" +
                "Keterangan:\n" +
                "Kerjakan nomor 1 sampai 5.",

    async execute(client, msg) {
        const text = msg.body.slice("!tambahtugas".length).trim();

        if(!text){
            const reply =
                "❌ Format salah!\n\n" +
                "Contoh:\n" +
                "!tambahtugas\n" +
                "Judul tugas: Tugas Pemrograman 1\n" +
                "Deadline: 15/04/2026 17:00\n" +
                "Pengumpulan: Google Classroom\n" +
                "Keterangan:\n" +
                "Kerjakan nomor 1 sampai 5.";
            await msg.reply(reply);
            return reply;
        }
        
        const titleMatch = text.match(/Judul tugas:\s*(.+)/i);
        const dateMatch = text.match(/Deadline:\s*(.+)/i);
        const pengumpulanMatch = text.match(/Pengumpulan:\s*(.+)/i);
        const keteranganMatch = text.match(/Keterangan:\s*([\s\S]*)/i);

        const title = titleMatch ? titleMatch[1].trim() : "";
        const deadlineStr = dateMatch ? dateMatch[1].trim() : "";
        const pengumpulan = pengumpulanMatch ? pengumpulanMatch[1].trim() : "";
        const keteranganRaw = keteranganMatch ? keteranganMatch[1].trim() : "";

        if(!title || !deadlineStr || !pengumpulan){
            const reply = "❌ Format belum lengkap!\n\n" +
                "Wajib ada:\n" +
                "- Judul tugas\n" +
                "- Deadline\n" +
                "- Pengumpulan\n\n" +
                "Contoh:\n" +
                "!tambahtugas\n" +
                "Judul tugas: Tugas Pemrograman 1\n" +
                "Deadline: 15/04/2026 17:00\n" +
                "Pengumpulan: Google Classroom\n" +
                "Keterangan:\n" +
                "Kerjakan nomor 1 sampai 5.";
            await msg.reply(reply);
            return reply;
        }

        const deadline = dayjs(deadlineStr, "DD/MM/YYYY HH:mm", true);
        if (!deadline.isValid()) {
            const reply = "❌ Format tanggal salah! Gunakan DD/MM/YYYY HH:mm. Contoh: 15/04/2026 17:00";
            await msg.reply(reply);
            return reply;
        }

        const filePath = path.join(__dirname, "../assets/assignment.json");
        let assignments = [];

        if (fs.existsSync(filePath)) {
            try {
                const rawData = fs.readFileSync(filePath, "utf-8");
                const parsed = JSON.parse(rawData);
                if (Array.isArray(parsed)) {
                    assignments = parsed;
                }
            } catch (err) {
                assignments = [];
            }
        }

        const keterangan = keteranganRaw
            ? keteranganRaw.split("\n").map(line => line.trim()).filter(Boolean)
            : [];

        const senderId = msg.author
            ? msg.author.replace("@c.us", "")
            : msg.from.replace("@c.us", "");

        const newAssignment = {
            title,
            deadline: deadline.toISOString(),
            pengumpulan,
            keterangan,
            addedBy: senderId,
            timestamp: new Date().toISOString()
        };

        assignments.push(newAssignment);
        fs.writeFileSync(filePath, JSON.stringify(assignments, null, 2));

        const keteranganText = keterangan.length
            ? keterangan.map(line => `- ${line}`).join("\n")
            : "-";

        const reply =
            `✅ *Tugas Ditambahkan!*\n\n` +
            `*Judul tugas:* ${title}\n` +
            `*Deadline:* ${deadline.format("DD/MM/YYYY HH:mm")}\n` +
            `*Pengumpulan:* ${pengumpulan}\n` +
            `*Keterangan:*\n${keteranganText}`;

        await msg.reply(reply);
        return reply;
    }
};