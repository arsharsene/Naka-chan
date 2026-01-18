const shared = require("../shared");

module.exports = {
  name: "bet_amount_100",
  async execute(interaction) {
    await placeBet(interaction, 100);
  },
};

async function placeBet(interaction, amount) {
  const userId = interaction.user.id;

  // Check if user has selected a horse
  if (!shared.pendingBets || !shared.pendingBets[userId]) {
    return interaction.reply({
      content: "❌ Please select a horse first!",
      flags: 64,
    });
  }

  if (!shared.joinedUsers.has(userId)) {
    return interaction.reply({
      content: "❌ You need to join the race first! Use `/joinrace`",
      flags: 64,
    });
  }

  const user = shared.getUser(userId);
  const horseId = shared.pendingBets[userId].horseId;
  const horse = shared.horses.find((h) => h.id === horseId);

  if (!horse) {
    return interaction.reply({
      content: "❌ Horse not found.",
      flags: 64,
    });
  }

  if (user.balance < amount) {
    return interaction.reply({
      content: `❌ Not enough carrats! You have 🥕 ${user.balance.toLocaleString()}`,
      flags: 64,
    });
  }

  if (shared.isAfterDeparture()) {
    return interaction.reply({
      content: "❌ Betting is closed!",
      flags: 64,
    });
  }

  // Place the bet
  user.balance -= amount;
  shared.bets[userId] = { horse, amount, horseId: horse.id };
  shared.saveUsers();
  shared.saveBets();

  // Also ensure user is in joinedUsers
  shared.joinedUsers.add(userId);

  // Clear pending bet
  delete shared.pendingBets[userId];

  const potentialWin = Math.floor(amount * horse.odds);

  await interaction.reply({
    content:
      `✅ **Bet placed!**\n\n` +
      `🐎 **Horse:** ${horse.name}\n` +
      `💰 **Amount:** 🥕 ${amount.toLocaleString()}\n` +
      `📈 **Odds:** ${horse.odds}x\n` +
      `🏆 **Potential Win:** 🥕 ${potentialWin.toLocaleString()}\n\n` +
      `Remaining balance: 🥕 ${user.balance.toLocaleString()}`,
    flags: 64,
  });
}

// Export the placeBet function for other handlers
module.exports.placeBet = placeBet;
