const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "admin_simlisthorses",
  async execute(interaction) {
    // Check if admin
    if (interaction.user.id !== process.env.ADMIN_ID) {
      return interaction.reply({ content: "❌ Admin only.", flags: 64 });
    }

    if (shared.simHorses.length === 0) {
      return interaction.reply({
        content: "❌ No sim horses configured. Use `/simsethorse` to add horses.",
        flags: 64,
      });
    }

    const rd = shared.simRaceDetail;
    const raceName = rd.raceName || "Simulation Race";

    // Sort horses by id
    const sortedHorses = [...shared.simHorses].sort((a, b) => a.id - b.id);

    // Create beautiful table-style horse list
    const horseLines = sortedHorses.map((h) => {
      const idStr = String(h.id).padStart(2, "0");
      const oddsStr = h.odds.toFixed(1);
      return `\`#${idStr}\` │ **${h.name}** │ \`${oddsStr}x\``;
    }).join("\n");

    // Status indicator
    const statusEmoji = shared.simRaceActive ? "🔴" : "🟢";
    const statusText = shared.simRaceActive ? "Running" : "Ready";

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setAuthor({ 
        name: `🎰 Simulation Race`,
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTitle(`🎲 ${raceName}`)
      .setDescription(
        `┃ 📍 **Venue:** ${rd.venue || "Virtual Track"}\n` +
        `┃ 📏 **Distance:** ${rd.distance || "2000m"}\n` +
        `┃ 🌱 **Condition:** ${rd.condition || "Good"}\n` +
        `┃ ${statusEmoji} **Status:** ${statusText}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `**📋 RUNNERS (${shared.simHorses.length})**\n` +
        `\`ID\` │ Horse Name │ \`Odds\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        horseLines
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: `Simulation Race • Total: ${shared.simHorses.length} horses` })
      .setTimestamp();

    // Action buttons for quick management
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin_refresh")
        .setLabel("🔄 Refresh")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("admin_listhorses")
        .setLabel("🏇 Main Horses")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin_back")
        .setLabel("◀ Back to Admin")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
  },
};
