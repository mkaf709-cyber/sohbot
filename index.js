const express = require("express");
const mineflayer = require("mineflayer");

// 1. WEB SERVER: Crucial for Render deployment
const app = express();

// Render sets the PORT automatically; we fall back to 10000
const port = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("Sohbot is alive and running on Render!");
});

// We MUST bind to "0.0.0.0" so Render's health check can find the bot
app.listen(port, "0.0.0.0", () => {
  console.log(`Web server listening on port ${port}`);
});

// 2. BOT LOGIC
function startBot() {
  const bot = mineflayer.createBot({
    host: "snakehead.aternos.host",
    port: 37497,
    username: "almomaeez",
    version: "1.21.9",
    auth: "offline",
  });

  bot.on("spawn", () => {
    console.log("Bot joined the Aternos server successfully!");
    
    // ANTI-AFK: Swings arm, jumps, and rotates every 30 seconds
    setInterval(() => {
      if (bot.entity) {
        bot.swingArm('right'); 
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);

        // Look around randomly
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI;
        bot.look(yaw, pitch, false);
      }
    }, 30000);
  });

  // Automatically respond to chat
  bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (message === "!status") {
      bot.chat("I am sohbot, running 24/7 on Render!");
    }
  });

  // AUTO-RECONNECT: Retries every 10 seconds if disconnected
  bot.on("end", () => {
    console.log("Disconnected. Reconnecting in 10 seconds...");
    setTimeout(startBot, 10000);
  });

  bot.on("error", (err) => {
    console.error("Connection Error:", err);
  });

  bot.on("kicked", (reason) => {
    console.log("Kicked for:", reason);
  });
}

// Start the bot
startBot();
