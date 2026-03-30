const fs = require("fs");
const path = require("path");

module.exports = {
    name: "help",
    description: "List all available commands",

    async execute(client, msg) {
        const prefix = "!";
        const commandFiles = fs.readdirSync(path.join(__dirname));
        let helpText = "*Available Commands:*\n\n";

        for (const file of commandFiles) {
            const cmd = require(`./${file}`);
            helpText += `*${prefix}${cmd.name}*`
            if (cmd.description) helpText += ` - ${cmd.description}`;
            helpText += "\n";
        }

        await msg.reply(helpText);
        
        return helpText;
    }
};