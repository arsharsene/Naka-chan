const shared = require("../shared");

module.exports = {
  name: "simbet_amount_all",
  async execute(interaction) {
    if (!shared.simRaceActive) {
      return interaction.reply({
        content: "❌ The race has already started or ended!",
        flags: 64,
      });
    }

    if (!shared.simPendingBets || !shared.simPendingBets[interaction.user.id]) {
      return interaction.reply({
        content: "❌ Please select a horse first!",
        flags: 64,
      });
    }

    const horseId = shared.simPendingBets[interaction.user.id].horseId;
    const horse = shared.simHorses.find((h) => h.id === horseId);

    if (!horse) {
      return interaction.reply({ content: "❌ Horse not found.", flags: 64 });
    }

    if (shared.simBets[interaction.user.id]) {
      return interaction.reply({ content: "❌ You already placed a bet!", flags: 64 });
    }

    const user = shared.getUser(interaction.user.id);
    const amount = user.balance;

    if (amount < 1) {
      return interaction.reply({
        content: "❌ You have no carrots to bet!",
        flags: 64,
      });
    }

    // Place bet and save
    user.balance = 0;
    shared.saveUsers();

    shared.simBets[interaction.user.id] = { horse, amount };
    delete shared.simPendingBets[interaction.user.id];

    // Reply with bet confirmation
    await interaction.update({
      content: `🎯 **ALL IN!** Bet: **${amount.toLocaleString()} 🥕** on **${horse.name}** (${horse.odds}x)!\n` +
        `💰 Potential payout: **${Math.floor(amount * horse.odds).toLocaleString()} 🥕**\n\n` +
        `*This message will disappear...*`,
      embeds: [],
      components: [],
    });

    // Auto dismiss after 3 seconds
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (e) {}
    }, 3000);
  },
};
