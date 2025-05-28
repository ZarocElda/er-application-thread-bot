const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

app.use(express.json());

client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

app.post('/application', async (req, res) => {
  const data = req.body;
  const channel = await client.channels.fetch(process.env.CHANNEL_ID); // must be a forum channel

  if (!channel) return res.status(404).send("Channel not found");

  const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  const embed = {
    title: "📋 New Member Application Submitted",
    description:
      `\n**🕒 Timestamp:** ${timestamp}\n\n` +
      `**🧙 RuneScape Display Name:** ${data.rsn}\n\n` +
      `**💬 Discord Display Name:** ${data.discord}\n\n` +
      `**📊 Total Level:** ${data.totalLevel}\n\n` +
      `**❓ How did you find us?:** ${data.foundUs}\n\n` +
      `**🏰 Current or Previous Clan(s):** ${data.previousClans}\n\n` +
      `**🎮 How active are you in RuneScape:** ${data.rsActivity}\n\n` +
      `**💬 How active will you be on Discord:** ${data.discordActivity}\n\n` +
      `**🌍 Time zone / country / play time:** ${data.timezone}\n\n` +
      `**📅 Commitment During Squire Period:** ${data.commitment}\n\n` +
      `**📖 Have you read our Rules?:** ${data.readRules}`,
    color: 3447003,
    timestamp: new Date().toISOString()
  };

  try {
    const thread = await channel.threads.create({
      name: `${data.rsn} Application`,
      autoArchiveDuration: 1440,
      message: {
        content: "<@&1377109800671776788> <@&1377109745046917120>",
        embeds: [embed]
      },
      // If your forum channel uses tags, include the tag ID(s) here:
      // appliedTags: ['YOUR_TAG_ID_HERE']
    });

    res.send("✅ Application thread created.");
  } catch (err) {
    console.error("❌ Error creating thread:", err);
    res.status(500).send("❌ Failed to create thread.");
  }
});

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

client.login(process.env.TOKEN);
app.listen(3000, () => console.log('🌐 Listening for form data...'));
