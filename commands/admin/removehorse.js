const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "removehorse",
  adminOnly: true,
  async execute(interaction) {
    const id = interaction.options.getInteger("id");

    const horse = shared.horses.find((h) => h.id === id);
    if (!horse) {
      return interaction.reply({
        content: `❌ No horse found with ID \`${id}\``,
        flags: 64,
      });
    }

    const removed = shared.removeHorse(id);

    if (removed) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("🗑️ Horse Removed")
        .setDescription(
          `**ID:** \`${id}\`\n` +
          `**Name:** ${horse.name}\n` +
          `**Odds:** ${horse.odds}x`
        )
        .setFooter({ text: `Remaining horses: ${shared.horses.length}` });

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({
        content: "❌ Failed to remove horse.",
        flags: 64,
      });
    }
  },
};
