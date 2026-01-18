const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "simremovehorse",
  adminOnly: true,
  async execute(interaction) {
    const id = interaction.options.getInteger("id");

    const horse = shared.simHorses.find((h) => h.id === id);
    if (!horse) {
      return interaction.reply({
        content: `❌ No sim horse found with ID \`${id}\``,
        flags: 64,
      });
    }

    const removed = shared.removeSimHorse(id);

    if (removed) {
      const embed = new EmbedBuilder()
        .setColor(0xe74c3c)
        .setTitle("🗑️ Sim Horse Removed")
        .setDescription(
          `**ID:** \`${id}\`\n` +
          `**Name:** ${horse.name}\n` +
          `**Odds:** ${horse.odds}x`
        )
        .setFooter({ text: `Remaining sim horses: ${shared.simHorses.length}` });

      await interaction.reply({ embeds: [embed] });
    } else {
      await interaction.reply({
        content: "❌ Failed to remove horse.",
        flags: 64,
      });
    }
  },
};
