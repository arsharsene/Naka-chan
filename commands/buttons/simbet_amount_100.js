const shared = require("../shared");

module.exports = {
  name: "simbet_amount_100",
  async execute(interaction) {
    await processSimBet(interaction, 100);
  },
};

async function processSimBet(interaction, amount) {
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

  if (user.balance < amount) {
    return interaction.reply({
      content: `❌ Not enough carrots! Balance: ${user.balance.toLocaleString()} 🥕`,
      flags: 64,
    });
  }

  // Place bet and save
  user.balance -= amount;
  shared.saveUsers();

  shared.simBets[interaction.user.id] = { horse, amount };
  delete shared.simPendingBets[interaction.user.id];

  // Reply with bet confirmation (will auto-dismiss after 5 seconds)
  await interaction.update({
    content: `✅ Bet placed: **${amount.toLocaleString()} 🥕** on **${horse.name}** (${horse.odds}x)!\n` +
      `💰 Potential: **${Math.floor(amount * horse.odds).toLocaleString()} 🥕** | Balance: **${user.balance.toLocaleString()} 🥕**\n\n` +
      `*This message will disappear...*`,
    embeds: [],
    components: [],
  });

  // Auto dismiss after 3 seconds
  setTimeout(async () => {
    try {
      await interaction.deleteReply();
    } catch (e) {
      // Message may already be gone
    }
  }, 3000);
}
