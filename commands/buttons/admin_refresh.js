const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "admin_refresh",
  async execute(interaction) {
    // Check if admin
    if (interaction.user.id !== process.env.ADMIN_ID) {
      return interaction.reply({ content: "❌ Admin only.", flags: 64 });
    }

    const rd = shared.raceDetail;
    const srd = shared.simRaceDetail;

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("🔄 Status Refreshed")
      .addFields(
        {
          name: "🏇 Main Race",
          value:
            `**Race:** ${rd.raceName || "—"}\n` +
            `**Venue:** ${rd.venue || "—"}\n` +
            `**Horses:** ${shared.horses.length}\n` +
            `**Bets:** ${Object.keys(shared.bets).length}`,
          inline: true,
        },
        {
          name: "🎰 Sim Race",
          value:
            `**Race:** ${srd.raceName || "—"}\n` +
            `**Venue:** ${srd.venue || "—"}\n` +
            `**Horses:** ${shared.simHorses.length}\n` +
            `**Active:** ${shared.simRaceActive ? "🔴 Yes" : "🟢 No"}`,
          inline: true,
        }
      )
      .setTimestamp()
      .setFooter({ text: "Live status update" });

    await interaction.reply({ embeds: [embed], flags: 64 });
  },
};
