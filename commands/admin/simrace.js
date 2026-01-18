const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const shared = require("../shared");
const path = require("path");
const fs = require("fs");
const { getRandomHorses } = require("../../data/uma_musume");

const raceTrackPath = path.join(__dirname, "..", "..", "data", "racetrack.png");
const tempDir = path.join(__dirname, "..", "..", "data", "temp");

// Ensure temp directory exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Track path - YELLOW OVAL LINE (between peach turf and blue infield)
// S marker at top-right, G marker at bottom-center
// Horses follow the yellow oval from S → clockwise → G
const trackPath = [
  // ===== START (S) =====
  { x: 544, y: 148 },
  { x: 640, y: 226 },
  { x: 682, y: 310 },
  // ===== RIGHT → CURVE 1 =====
  { x: 676, y: 376 },
  { x: 543, y: 462 },
  { x: 485, y: 455 },
  // ==== BOTTOM STRAIGHT 1 =====
  { x: 422, y: 464 },
  { x: 479, y: 464 },
  // ===== LEFT → CURVE  =====
  { x: 255, y: 458 },
  { x: 139, y: 372 },
  { x: 170, y: 241 },
  // ===== TOP → STRAIGHT =====
  { x: 268, y: 200 },
  { x: 380, y: 200 },
  { x: 532, y: 200 },
   // ===== RIGHT → CURVE 1 =====
  { x: 621, y: 230 },
  { x: 677, y: 339 },
  { x: 588, y: 441 },
  { x: 534, y: 456 },
  // ==== BOTTOM STRAIGHT 2 (YELLOW LINE) =====
  { x: 484, y: 457 },
  { x: 400, y: 457 },
  // ===== FINISH (G) =====
  { x: 317, y: 457 }
];


// Colors for each horse
const horseColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#F39C12", "#9B59B6", "#1ABC9C", "#E74C3C",
];

function getPositionOnTrack(progress) {
  const totalPoints = trackPath.length - 1;
  const exactPos = (progress / 100) * totalPoints;
  const index = Math.floor(exactPos);
  const fraction = exactPos - index;

  if (index >= totalPoints) {
    return trackPath[totalPoints];
  }

  const p1 = trackPath[index];
  const p2 = trackPath[index + 1];

  return {
    x: p1.x + (p2.x - p1.x) * fraction,
    y: p1.y + (p2.y - p1.y) * fraction,
  };
}

async function generateRaceImage(positions, horses, stageInfo) {
  const trackImage = await loadImage(raceTrackPath);
  const canvas = createCanvas(trackImage.width, trackImage.height);
  const ctx = canvas.getContext("2d");

  // Draw the track
  ctx.drawImage(trackImage, 0, 0);

  // Draw stage info banner with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, "rgba(30, 30, 60, 0.9)");
  gradient.addColorStop(1, "rgba(60, 30, 80, 0.9)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, 50);
  
  // Stage title
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 20px Arial";
  ctx.fillText(`${stageInfo.emoji} ${stageInfo.title}`, 15, 30);
  
  // Stage/section info
  ctx.font = "14px Arial";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(`Stage ${stageInfo.stage}/7  •  ${stageInfo.section}`, 15, 46);

  // Progress bar with rounded corners
  const barWidth = 160;
  const barHeight = 14;
  const barX = canvas.width - barWidth - 15;
  const barY = 20;
  
  // Bar background
  ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
  ctx.fillRect(barX, barY, barWidth, barHeight);
  
  // Bar fill with color gradient based on progress
  const progressGrad = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
  progressGrad.addColorStop(0, "#2ECC71");
  progressGrad.addColorStop(1, "#27AE60");
  ctx.fillStyle = progressGrad;
  ctx.fillRect(barX, barY, (stageInfo.progress / 100) * barWidth, barHeight);
  
  // Progress text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(`${stageInfo.progress}%`, barX + barWidth / 2, barY + 11);
  ctx.textAlign = "left";

  // Sort horses by position (draw back to front)
  const sortedHorses = [...horses]
    .map((h, i) => ({ ...h, pos: positions[h.id] || 0, colorIndex: i }))
    .sort((a, b) => a.pos - b.pos);

  // Draw horses on track with shadows and larger markers
  for (const horse of sortedHorses) {
    const pos = getPositionOnTrack(horse.pos);
    const color = horseColors[horse.colorIndex % horseColors.length];

    // Shadow
    ctx.beginPath();
    ctx.arc(pos.x + 2, pos.y + 2, 15, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fill();

    // Main circle with gradient
    const horseGrad = ctx.createRadialGradient(pos.x - 3, pos.y - 3, 0, pos.x, pos.y, 15);
    horseGrad.addColorStop(0, "#FFFFFF");
    horseGrad.addColorStop(0.3, color);
    horseGrad.addColorStop(1, color);
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = horseGrad;
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Horse number
    ctx.fillStyle = "#000000";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(horse.id.toString(), pos.x, pos.y);
  }

  // Draw legend at bottom with gradient
  const legendGrad = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
  legendGrad.addColorStop(0, "rgba(30, 30, 60, 0.95)");
  legendGrad.addColorStop(1, "rgba(20, 20, 40, 0.95)");
  ctx.fillStyle = legendGrad;
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

  // Get current rankings
  const ranked = [...horses]
    .map((h) => ({ ...h, pos: positions[h.id] || 0 }))
    .sort((a, b) => b.pos - a.pos);

  const legendStartX = 15;
  const legendY = canvas.height - 20;
  
  ctx.textAlign = "left";
  
  // Show top 5 with position
  for (let i = 0; i < Math.min(ranked.length, 5); i++) {
    const h = ranked[i];
    const x = legendStartX + i * 125;
    const rank = i + 1;
    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
    
    // Color dot
    ctx.fillStyle = horseColors[horses.findIndex(ho => ho.id === h.id) % horseColors.length];
    ctx.beginPath();
    ctx.arc(x + 5, legendY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Rank and name
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "11px Arial";
    ctx.fillText(`${medals[i]} ${h.name.substring(0, 10)}`, x + 16, legendY + 4);
  }

  return canvas.toBuffer("image/png");
}

// Race stages
const raceStages = [
  { stage: 1, emoji: "🚦", title: "GATE OPEN!", jpn: "ゲートが開いた！", eng: "They're off!", section: "Start", progress: 8, color: 0x2ecc71 },
  { stage: 2, emoji: "🔥", title: "FIRST TURN", jpn: "第1コーナー！", eng: "First corner!", section: "1st Turn", progress: 22, color: 0x3498db },
  { stage: 3, emoji: "💨", title: "BACKSTRETCH", jpn: "向正面", eng: "Down the back...", section: "Back", progress: 38, color: 0x9b59b6 },
  { stage: 4, emoji: "⚡", title: "FAR TURN", jpn: "第3コーナー！", eng: "Far turn!", section: "3rd Turn", progress: 52, color: 0xe67e22 },
  { stage: 5, emoji: "🔥", title: "FINAL CORNER", jpn: "最終コーナー！", eng: "Final corner!", section: "4th Turn", progress: 68, color: 0xe74c3c },
  { stage: 6, emoji: "⚡", title: "FINAL STRETCH!", jpn: "直線！残り200m！", eng: "Home stretch!", section: "Stretch", progress: 85, color: 0xe74c3c },
  { stage: 7, emoji: "🏁", title: "PHOTO FINISH!", jpn: "ゴール！！", eng: "AT THE WIRE!", section: "Finish", progress: 100, color: 0xf1c40f },
];

function buildWaitingEmbed(betCount) {
  // Use SIM race data
  const rd = shared.simRaceDetail;
  const raceName = rd.raceName || "Simulation Race";

  // Sort simHorses by id
  const sortedHorses = [...shared.simHorses].sort((a, b) => a.id - b.id);

  // NO fav for simrace
  const horseLines = sortedHorses.slice(0, 10).map((h) => {
    return `\`#${String(h.id).padStart(2, "0")}\` ${h.name} ─ \`${h.odds}x\``;
  }).join("\n");

  return new EmbedBuilder()
    .setColor(0x9b59b6)
    .setAuthor({ name: "🎰 SIMULATION RACE" })
    .setTitle(`🏆 ${raceName}`)
    .setDescription(
      `📍 **${rd.venue}** • ${rd.distance}\n` +
      `🌤️ Condition: ${rd.condition || "Good"}\n` +
      `─────────────────────────\n` +
      `⏳ **Race starting in 30 seconds!**\n` +
      `🎰 Click the **Bet** button below to place your bet!\n` +
      `─────────────────────────\n` +
      `**🐎 RUNNERS (${shared.simHorses.length})**\n` +
      `─────────────────────────\n` +
      `\ ID\ ─ Horse ─ \ Odds\n` +
      `─────────────────────────\n` +
      horseLines + `\n\n` +
      `**📊 Bets:** ${betCount} • **Status:** 🟢 OPEN`
    )
    .setImage("attachment://racetrack.png")
    .setFooter({ text: "Press 🎰 Bet to place your wager! Good luck! 🍀" })
    .setTimestamp();
}

function buildRaceEmbed(stage, leadingHorse, betCount) {
  const rd = shared.simRaceDetail;
  const raceName = rd.raceName || "Simulation Race";

  return new EmbedBuilder()
    .setColor(stage.color)
    .setAuthor({ name: `📍 ${stage.section} • Stage ${stage.stage}/7` })
    .setTitle(`${stage.emoji} ${stage.title}`)
    .setDescription(
      `**${raceName}** @ ${rd.venue}\n\n` +
      `🎙️ _"${stage.jpn}"_\n` +
      `📢 _"${stage.eng}"_\n\n` +
      `👑 **Leader:** ${leadingHorse.name}`
    )
    .setImage("attachment://race_anim.png")
    .setFooter({ text: `📊 ${betCount} bets • Watch the track!` })
    .setTimestamp();
}

function buildResultEmbed(winner, payoutLog) {
  const rd = shared.simRaceDetail;
  const raceName = rd.raceName || "Simulation Race";

  const payoutSection = payoutLog.length > 0
    ? `\n**💰 Payouts:**\n${payoutLog.join("\n")}`
    : "\n💔 No winning bets this race.";

  return new EmbedBuilder()
    .setColor(0xf1c40f)
    .setAuthor({ name: "🏆 RACE COMPLETE" })
    .setTitle(`🎊 ${raceName}`)
    .setDescription(
      `📍 ${rd.venue} • ${rd.distance}\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `🥇 **WINNER:** ${winner.name} (\`${winner.odds}x\`)\n` +
      `━━━━━━━━━━━━━━━━━━━━━` +
      payoutSection
    )
    .setImage("attachment://race_anim.png")
    .setFooter({ text: "Simulation Race • Thanks for watching! 🐎" })
    .setTimestamp();
}

module.exports = {
  name: "simrace",
  adminOnly: true,
  async execute(interaction) {
    if (shared.simRaceActive) {
      return interaction.reply({ content: "❌ A race is already running!", flags: 64 });
    }

    // Generate random Uma Musume horses for this race
    const randomHorses = getRandomHorses(6);
    shared.simHorses.length = 0;
    shared.simHorses.push(...randomHorses);
    shared.saveSimHorses();
    
    console.log("🐎 Generated random Uma Musume horses:", randomHorses.map(h => h.name).join(", "));

    shared.simRaceActive = true;
    shared.simBets = {};

    const positions = {};
    shared.simHorses.forEach((h) => { positions[h.id] = 0; });

    const attachment = new AttachmentBuilder(raceTrackPath, { name: "racetrack.png" });
    const embed = buildWaitingEmbed(0);

    // Bet button for users
    const betRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("simrace_bet")
        .setLabel("🎰 Bet Now!")
        .setStyle(ButtonStyle.Success)
    );

    // Send waiting phase with bet button
    const reply = await interaction.reply({
      embeds: [embed],
      files: [attachment],
      components: [betRow],
    });
    
    shared.simMessage = await interaction.fetchReply();

    setTimeout(async () => {
      if (!shared.simRaceActive) return;

      const betCount = Object.keys(shared.simBets).length;

      for (let i = 0; i < raceStages.length; i++) {
        await new Promise((r) => setTimeout(r, 3500));

        const stage = raceStages[i];

        // Update positions using SIM horses
        shared.simHorses.forEach((h) => {
          const speedFactor = 1 / h.odds;
          const randomness = Math.random() * 10 - 3;
          positions[h.id] = Math.min(100, stage.progress + randomness + speedFactor * 6);
        });

        // Find leader
        let leadingHorse = shared.simHorses[0];
        let maxPos = 0;
        shared.simHorses.forEach((h) => {
          if (positions[h.id] > maxPos) {
            maxPos = positions[h.id];
            leadingHorse = h;
          }
        });

        try {
          // Generate race image with SIM horses
          const imageBuffer = await generateRaceImage(positions, shared.simHorses, stage);
          const raceAttachment = new AttachmentBuilder(imageBuffer, { name: "race_anim.png" });
          const update = buildRaceEmbed(stage, leadingHorse, betCount);

          await shared.simMessage.edit({ embeds: [update], files: [raceAttachment], components: [] });
        } catch (e) {
          console.error("Race update error:", e);
        }
      }

      // Determine winner from SIM horses
      const winner = shared.simulateWinner(shared.simHorses);
      positions[winner.id] = 100;

      // Calculate payouts
      let payoutLog = [];
      for (const userId in shared.simBets) {
        const bet = shared.simBets[userId];
        if (bet.horse.id === winner.id) {
          const payout = Math.floor(bet.amount * bet.horse.odds);
          shared.users[userId].balance += payout;
          payoutLog.push(`<@${userId}> ─ 🥕 **+${payout.toLocaleString()}**`);
        }
      }

      shared.saveUsers();

      // Final image with winner at finish
      const finalStage = { ...raceStages[6], title: `${winner.name} WINS!` };
      const finalBuffer = await generateRaceImage(positions, shared.simHorses, finalStage);
      const finalAttachment = new AttachmentBuilder(finalBuffer, { name: "race_anim.png" });
      const result = buildResultEmbed(winner, payoutLog);

      shared.simRaceActive = false;
      shared.simBets = {};
      shared.simMessage = null;

      await interaction.followUp({ embeds: [result], files: [finalAttachment] });
    }, 30 * 1000);
  },
};
