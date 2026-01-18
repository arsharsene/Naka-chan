const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "help_racedetails",
  async execute(interaction) {
    const rd = shared.raceDetail;
    const raceName = rd.raceName || "Race";

    // Sort by id for display
    const sortedHorses = [...shared.horses].sort((a, b) => a.id - b.id);

    // Create table-style horse list
    const horseLines = sortedHorses.slice(0, 13).map((h) => {
      const favBadge = h.fav === 1 ? "⭐ " : h.fav <= 3 ? "🔥 " : "";
      const favRank = h.fav ? `${h.fav}` : "";
      return `\`#${String(h.id).padStart(2, "0")}\` ${h.name} ─ \`${h.odds}x\` ─ ${favBadge}${favRank}`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x1a1a2e)
      .setAuthor({ name: `🏇 ${rd.venue || "—"} Racecourse` })
      .setTitle(`${rd.raceNo || ""} ${raceName}`)
      .setDescription(
        `┃ 🏆 **Grade:** ${rd.grade || "—"}  ┃  📏 **${rd.distance}**\n` +
        `┃ 📅 **${rd.date}**  ┃  🕐 **${rd.departure}**\n` +
        `┃ 🌤️ ${rd.weather || "Sunny"}  ┃  🌱 ${rd.condition || "Good"}\n` +
        `─────────────────────────\n` +
        `${shared.countdown()}\n` +
        `─────────────────────────\n` +
        `**🐎 RUNNERS (${shared.horses.length})**\n` +
        `─────────────────────────\n` +
        `\ ID \ ─ Horse ─ \ Odds\ ─ Fav\n` +
        `─────────────────────────\n` +
        horseLines
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: "⭐ Favorite • 🔥 Top 3" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });

    // Auto-dismiss after 15 seconds
    setTimeout(async () => {
      try { await interaction.deleteReply(); } catch (e) {}
    }, 15000);
  },
};
