const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "simsetrace",
  adminOnly: true,
  async execute(interaction) {
    const name = interaction.options.getString("name");
    const venue = interaction.options.getString("venue");
    const distance = interaction.options.getString("distance");
    const condition = interaction.options.getString("condition");

    const updates = [];

    if (name) {
      shared.setSimRaceName(name);
      updates.push(`**Race Name:** ${name}`);
    }
    if (venue) {
      shared.setSimRaceDetail("venue", venue);
      updates.push(`**Venue:** ${venue}`);
    }
    if (distance) {
      shared.setSimRaceDetail("distance", distance);
      updates.push(`**Distance:** ${distance}`);
    }
    if (condition) {
      shared.setSimRaceDetail("condition", condition);
      updates.push(`**Condition:** ${condition}`);
    }

    if (updates.length === 0) {
      return interaction.reply({
        content: "❌ No fields provided. Use name, venue, distance, or condition.",
        flags: 64,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle("🎰 Sim Race Updated")
      .setDescription(updates.join("\n"))
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
