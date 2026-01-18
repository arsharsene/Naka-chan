const { SlashCommandBuilder } = require("discord.js");
const shared = require("../shared");
const { scrapeRace, scrapeHorses } = require("../../scraper");

module.exports = {
  name: "importrace",
  adminOnly: true,
  data: new SlashCommandBuilder()
    .setName("importrace")
    .setDescription("Import race data from netkeiba.com")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("Netkeiba race URL (e.g., https://en.netkeiba.com/race/shutuba.html?race_id=...)")
        .setRequired(true)
    ),

  async execute(interaction) {
    // Check if user is admin
    if (!shared.isGuildAdmin(interaction.guildId, interaction.user.id)) {
      return interaction.reply({
        content: "❌ Only bot admins can use this command.",
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const url = interaction.options.getString("url");

    try {
      // Validate URL
      if (!url.includes("netkeiba.com") || !url.includes("race_id=")) {
        return interaction.editReply({
          content: "❌ Invalid URL. Please provide a valid netkeiba.com race URL.",
        });
      }

      // Scrape race details
      const raceData = await scrapeRace(url);
      
      // Scrape horse list
      const horsesData = await scrapeHorses(url);

      if (horsesData.length === 0) {
        return interaction.editReply({
          content: "❌ Could not find any horses. The race may not be available yet.",
        });
      }

      // Update race details
      Object.assign(shared.raceDetail, raceData);
      shared.saveRaceDetail();

      // Update horses
      shared.horses.length = 0;
      shared.horses.push(...horsesData);
      shared.saveHorses();

      // Clear existing bets for clean slate
      Object.keys(shared.bets).forEach((key) => delete shared.bets[key]);
      shared.joinedUsers.clear();
      shared.saveBets();
      shared.raceClosed = false;

      // Build response embed
      const { EmbedBuilder } = require("discord.js");
      const embed = new EmbedBuilder()
        .setColor(0x2ecc71)
        .setTitle("✅ Race Imported Successfully!")
        .setDescription(
          `**${raceData.raceName}** (${raceData.grade})\n` +
          `📍 ${raceData.venue} ${raceData.raceNo}\n` +
          `📅 ${raceData.date} at ${raceData.departure}\n` +
          `📏 ${raceData.distance}`
        )
        .addFields({
          name: `🐎 ${horsesData.length} Horses Imported`,
          value: horsesData
            .slice(0, 10)
            .map((h) => `${h.id}. ${h.name} (${h.odds}x)`)
            .join("\n") + (horsesData.length > 10 ? `\n...and ${horsesData.length - 10} more` : ""),
        })
        .setFooter({ text: `Source: ${url}` });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Import race error:", error);
      await interaction.editReply({
        content: `❌ Error importing race: ${error.message}`,
      });
    }
  },
};
