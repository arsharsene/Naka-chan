const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "leaderboard",
  async execute(interaction) {
    const sorted = Object.entries(shared.users)
      .sort((a, b) => b[1].balance - a[1].balance)
      .slice(0, 10);

    if (!sorted.length) {
      return interaction.reply({
        content: "No data available.",
        ephemeral: true,
      });
    }

    const list = sorted
      .map(([id, data], i) => `**${i + 1}.** <@${id}> — 🥕 **${data.balance}**`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("🏆 Leaderboard")
      .setDescription(list)
      .setFooter({ text: "Top players by balance" });

    await interaction.reply({ embeds: [embed], flags: 64 });

    // Auto-dismiss after 5 seconds
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (e) {}
    }, 5000);
  },
};
