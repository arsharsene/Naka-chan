const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "mybets",
  async execute(interaction) {
    const userId = interaction.user.id;
    const userBet = shared.bets[userId];

    // Check current active bet
    if (!userBet) {
      return interaction.reply({
        content: "📋 You have no active bets. Use `/joinrace` to place a bet!",
        flags: 64,
      });
    }

    const rd = shared.raceDetail;
    const horse = userBet.horse || shared.horses.find((h) => h.id === userBet.horseId);
    const horseName = horse ? horse.name : "Unknown";
    const odds = horse ? horse.odds : 0;
    const potentialWin = Math.floor(userBet.amount * odds);

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("📋 Your Current Bet")
      .setDescription(
        `🏁 **Race:** ${rd.raceName || "Current Race"}\n` +
        `📍 **Venue:** ${rd.venue || "—"} ${rd.raceNo || ""}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n\n` +
        `🐎 **Horse:** ${horseName}\n` +
        `💰 **Bet Amount:** 🥕 ${userBet.amount.toLocaleString()}\n` +
        `📈 **Odds:** ${odds}x\n` +
        `🏆 **Potential Win:** 🥕 ${potentialWin.toLocaleString()}\n\n` +
        `━━━━━━━━━━━━━━━━━━\n` +
        `**Countdown:** ${shared.countdown()}`
      )
      .setFooter({ text: "Good luck with your bet!" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });

    // Auto-dismiss after 5 seconds
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (e) {}
    }, 5000);
  },
};
