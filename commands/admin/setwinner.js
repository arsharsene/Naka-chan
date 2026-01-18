const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setwinner",
  adminOnly: true,
  async execute(interaction) {
    if (shared.raceClosed) {
      return interaction.reply({
        content: "⛔ Winner already set. Race is closed.",
        ephemeral: true,
      });
    }

    const horseId = interaction.options.getInteger("horse");
    const winner = shared.horses.find((h) => h.id === horseId);

    if (!winner) {
      return interaction.reply({
        content: "❌ Invalid horse ID.",
        ephemeral: true,
      });
    }

    shared.raceClosed = true;

    let winners = [];
    let totalPaid = 0;

    for (const oddsUserId in shared.bets) {
      const bet = shared.bets[oddsUserId];

      if (bet.horse.id === horseId) {
        const payout = Math.floor(bet.amount * winner.odds);
        shared.users[oddsUserId].balance += payout;
        totalPaid += payout;
        winners.push(`<@${oddsUserId}> won 🥕 ${payout.toLocaleString()}`);
      }
    }

    shared.saveUsers();

    // Clear all bets and joined users for next race
    Object.keys(shared.bets).forEach((key) => delete shared.bets[key]);
    shared.joinedUsers.clear();
    shared.saveBets();

    const embed = new EmbedBuilder()
      .setColor(0xf1c40f)
      .setTitle("🏆 RACE RESULT")
      .setDescription(
        `🥇 **Winner:** ${winner.name}\n` +
          `📍 ${shared.raceDetail.venue} ${shared.raceDetail.raceNo}\n\n` +
          (winners.length
            ? `**🎉 Winners:**\n${winners.join("\n")}`
            : "😔 No one won this race.")
      )
      .addFields(
        { name: "💰 Total Paid", value: `🥕 ${totalPaid.toLocaleString()}`, inline: true },
        {
          name: "📊 Total Bets",
          value: `${Object.keys(shared.bets).length}`,
          inline: true,
        }
      )
      .setFooter({ text: "Race closed • Betting locked" });

    return interaction.reply({ embeds: [embed] });
  },
};
