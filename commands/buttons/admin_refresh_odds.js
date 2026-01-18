const shared = require("../shared");
const { scrapeHorses } = require("../../scraper");

module.exports = {
  name: "admin_refresh_odds",
  async execute(interaction) {
    // Check if we have a netkeiba URL
    const url = shared.raceDetail.netkeibaUrl;
    if (!url) {
      return interaction.reply({
        content: "❌ No netkeiba URL found. Import a race first with `/importrace`.",
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    try {
      // Re-scrape horses to get updated odds
      const newHorses = await scrapeHorses(url);
      
      if (newHorses.length === 0) {
        return interaction.editReply({
          content: "❌ Could not scrape horses from netkeiba. The page structure may have changed.",
        });
      }

      // Update odds for existing horses by name match
      let updatedCount = 0;
      newHorses.forEach((newH) => {
        const existing = shared.horses.find(h => h.name === newH.name);
        if (existing && newH.odds !== 10.0) {
          existing.odds = newH.odds;
          existing.fav = newH.fav;
          updatedCount++;
        }
      });

      shared.saveHorses();

      await interaction.editReply({
        content: `✅ **Odds Refreshed!**\n` +
          `Updated **${updatedCount}** horses with new odds.\n\n` +
          `**Current horses:**\n` +
          shared.horses.map(h => `\`#${h.id}\` ${h.name} - **${h.odds}x** (fav ${h.fav})`).join("\n"),
      });
    } catch (error) {
      console.error("Error refreshing odds:", error);
      await interaction.editReply({
        content: `❌ Error refreshing odds: ${error.message}`,
      });
    }
  },
};
