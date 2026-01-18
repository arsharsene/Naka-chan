const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "simlisthorses",
  adminOnly: true,
  async execute(interaction) {
    if (shared.simHorses.length === 0) {
      return interaction.reply({
        content: "❌ No sim horses configured. Use `/simsethorse` to add horses.",
        flags: 64,
      });
    }

    const rd = shared.simRaceDetail;
    const raceName = rd.raceName || "Simulation Race";

    // Sort by id for display
    const sortedHorses = [...shared.simHorses].sort((a, b) => a.id - b.id);

    // Create table-style horse list (NO fav for sim)
    const horseLines = sortedHorses.map((h) => {
      return `\`#${String(h.id).padStart(2, "0")}\` ${h.name} ─ \`${h.odds}x\``;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setAuthor({ name: `🎰 Simulation Race` })
      .setTitle(`${raceName}`)
      .setDescription(
        `📍 **Venue:** ${rd.venue || "Virtual Track"}\n` +
        `📏 **Distance:** ${rd.distance || "2000m"}\n` +
        `🌱 **Condition:** ${rd.condition || "Good"}\n\n` +
        `**Status:** ${shared.simRaceActive ? "🔴 Running" : "🟢 Ready"}\n\n` +
        `**🐎 RUNNERS (${shared.simHorses.length})**\n` +
        `\`ID\`  Name ─ \`Odds\`\n` +
        `─────────────────────────\n` +
        horseLines
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: `Admin View` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
