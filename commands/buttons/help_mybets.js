const { EmbedBuilder } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "help_mybets",
  async execute(interaction) {
    const userId = interaction.user.id;
    const userBet = shared.bets[userId];

    // Check if user has a bet
    if (!userBet) {
      return interaction.reply({
        content: "📋 You haven't placed any bets yet!",
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
        `**Race:** ${rd.raceName || "Current Race"}\n` +
        `🐎 **Horse:** ${horseName}\n` +
        `💰 **Amount:** 🥕 ${userBet.amount.toLocaleString()}\n` +
        `📈 **Odds:** ${odds}x\n` +
        `🏆 **Potential Win:** 🥕 ${potentialWin.toLocaleString()}\n` +
        `\n━━━━━━━━━━━━━━━━━━\n` +
        `**Countdown:** ${shared.countdown()}`
      )
      .setFooter({ text: "Good luck!" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: 64 });

    // Auto-dismiss after 15 seconds
    setTimeout(async () => {
      try { await interaction.deleteReply(); } catch (e) {}
    }, 15000);
  },
};
