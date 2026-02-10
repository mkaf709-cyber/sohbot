const express = require("express");
const mineflayer = require("mineflayer");

// 1. WEB SERVER: Keeps CodeSandbox alive via UptimeRobot
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Bot is online and keeping the sandbox alive!");
});

app.listen(port, () => {
  console.log(`Web server active on port ${port}`);
});

// 2. BOT LOGIC: The Minecraft connection
function startBot() {
  const bot = mineflayer.createBot({
    host: "scup.aternos.host",
    port: 37497,
    username: "sohbot",
    version: "1.21.1",
    auth: "offline",
  });

  bot.on("spawn", () => {
    console.log("Bot joined the Aternos server successfully!");

    // ANTI-AFK: Swings arm, jumps, and rotates every 30 seconds
    setInterval(() => {
      if (bot.entity) {
        // Swing arm
        bot.swingArm("right");

        // Jump
        bot.setControlState("jump", true);
        setTimeout(() => bot.setControlState("jump", false), 500);

        // Look around randomly
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, false);
      }
    }, 30000);
  });

  // Automatically respond to chat (Bonus)
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (message === "!status") {
      bot.chat("I am sohbot, the 24/7 guardian of this server!");
    }
  });

  // AUTO-RECONNECT: If the server restarts, the bot waits 10s and tries again
  bot.on("end", () => {
    console.log("Disconnected from server. Retrying in 10 seconds...");
    setTimeout(startBot, 10000);
  });

  bot.on("error", (err) => {
    console.error("Connection Error:", err);
  });

  bot.on("kicked", (reason) => {
    console.log("Kicked from server for:", reason);
  });
}

// Start the bot for the first time
startBot();
