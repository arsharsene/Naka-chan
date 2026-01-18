const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "help_balance",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle("💰 Your Balance")
      .setDescription(
        `**${interaction.user.username}**\n\n` +
        `🥕 **${user.balance.toLocaleString()}** carrats`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });

    // Auto-dismiss after 15 seconds
    setTimeout(async () => {
      try { await interaction.deleteReply(); } catch (e) {}
    }, 15000);
  },
};
