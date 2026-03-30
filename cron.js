const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");

const assignmentFile = path.join(__dirname, "assets/assignment.json");

function cleanExpiredAssignments() {
    if (!fs.existsSync(assignmentFile)) return;

    let assignments = JSON.parse(fs.readFileSync(assignmentFile, "utf-8"));
    const now = dayjs();
    const beforeCount = assignments.length;

    assignments = assignments.filter(t => dayjs(t.deadline).isAfter(now));

    const afterCount = assignments.length;

    if (beforeCount !== afterCount) {
        fs.writeFileSync(assignmentFile, JSON.stringify(assignments, null, 2));
        console.log(`🗑️ ${beforeCount - afterCount} tugas sudah lewat deadline dan dihapus.`);
    }
}

// Cron job setiap 5 menit
cron.schedule("*/5 * * * *", () => {
    console.log("Cron Job: membersihkan tugas yang sudah lewat deadline...");
    cleanExpiredAssignments();
});

module.exports = { cleanExpiredAssignments };