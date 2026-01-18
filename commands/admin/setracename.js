const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setracename",
  adminOnly: true,
  async execute(interaction) {
    const name = interaction.options.getString("name");

    shared.setRaceName(name);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("🏆 Race Name Updated")
      .setDescription(`**New Race Name:** ${name}`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
