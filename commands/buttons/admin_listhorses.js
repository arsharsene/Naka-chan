const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "admin_listhorses",
  async execute(interaction) {
    // Check if admin
    if (interaction.user.id !== process.env.ADMIN_ID) {
      return interaction.reply({ content: "❌ Admin only.", flags: 64 });
    }

    if (shared.horses.length === 0) {
      return interaction.reply({
        content: "❌ No horses configured. Use `/sethorse` to add horses.",
        flags: 64,
      });
    }

    const rd = shared.raceDetail;
    const raceName = rd.raceName || "Race";

    // Sort horses by id
    const sortedHorses = [...shared.horses].sort((a, b) => a.id - b.id);

    // Create beautiful table-style horse list
    const horseLines = sortedHorses.map((h) => {
      const idStr = String(h.id).padStart(2, "0");
      const oddsStr = h.odds.toFixed(1);
      const favBadge = h.fav === 1 ? " ⭐" : h.fav <= 3 ? " 🔥" : "";
      return `\`#${idStr}\` │ **${h.name}** │ \`${oddsStr}x\`${favBadge}`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setColor(0xe67e22)
      .setAuthor({ 
        name: `🏇 ${rd.venue || "Racecourse"} • ${rd.raceNo || ""}`,
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTitle(`🐎 ${raceName}`)
      .setDescription(
        `┃ 🏆 **Grade:** ${rd.grade || "—"}  ┃  📏 **${rd.distance || "—"}**\n` +
        `┃ 📅 **${rd.date || "—"}**\n` +
        `┃ 🕐 **Departure:** ${rd.departure || "—"}\n` +
        `┃ 🌤️ ${rd.weather || "Sunny"}  ┃  🌱 ${rd.condition || "Good"}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `**📋 RUNNERS (${shared.horses.length})**\n` +
        `\`ID\` │ Horse Name │ \`Odds\`\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        horseLines
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: `⭐ Favorite • 🔥 Top 3 • Total: ${shared.horses.length} horses` })
      .setTimestamp();

    // Action buttons for quick management
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin_refresh")
        .setLabel("🔄 Refresh")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("admin_simlisthorses")
        .setLabel("🎰 Sim Horses")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin_back")
        .setLabel("◀ Back to Admin")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row], flags: 64 });
  },
};
