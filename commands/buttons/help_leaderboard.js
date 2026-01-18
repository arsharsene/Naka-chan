const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "help_leaderboard",
  async execute(interaction) {
    const sortedUsers = Object.entries(shared.users)
      .map(([id, data]) => ({ id, balance: data.balance || 0 }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 10);

    if (sortedUsers.length === 0) {
      return interaction.reply({
        content: "📊 No players yet!",
        flags: 64,
      });
    }

    const medals = ["🥇", "🥈", "🥉"];
    const lines = await Promise.all(
      sortedUsers.map(async (u, i) => {
        const medal = medals[i] || `\`${i + 1}.\``;
        try {
          const user = await interaction.client.users.fetch(u.id);
          return `${medal} **${user.username}** — 🥕 ${u.balance.toLocaleString()}`;
        } catch {
          return `${medal} Unknown — 🥕 ${u.balance.toLocaleString()}`;
        }
      })
    );

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("🏆 Leaderboard")
      .setDescription(lines.join("\n"))
      .setFooter({ text: `Top ${sortedUsers.length} players` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });

    // Auto-dismiss after 15 seconds
    setTimeout(async () => {
      try { await interaction.deleteReply(); } catch (e) {}
    }, 15000);
  },
};
