const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "sethorse",
  adminOnly: true,
  async execute(interaction) {
    const id = interaction.options.getInteger("id");
    const name = interaction.options.getString("name");
    const odds = interaction.options.getNumber("odds");

    if (id < 1 || id > 99) {
      return interaction.reply({
        content: "❌ Horse ID must be between 1 and 99.",
        flags: 64,
      });
    }

    if (odds <= 1) {
      return interaction.reply({
        content: "❌ Odds must be greater than 1.0",
        flags: 64,
      });
    }

    const isUpdate = shared.horses.some((h) => h.id === id);
    shared.addOrUpdateHorse(id, name, odds);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(isUpdate ? "🐎 Horse Updated" : "🐎 Horse Added")
      .setDescription(
        `**ID:** \`${id}\`\n` +
        `**Name:** ${name}\n` +
        `**Odds:** ${odds}x`
      )
      .setFooter({ text: `Total horses: ${shared.horses.length}` });

    await interaction.reply({ embeds: [embed] });
  },
};
