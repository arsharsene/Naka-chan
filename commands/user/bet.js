const shared = require("../shared");

module.exports = {
  name: "bet",
  async execute(interaction) {
    const userId = interaction.user.id;
    const user = shared.getUser(userId);

    if (!shared.joinedUsers.has(userId)) {
      return interaction.reply({
        content: "❌ Join the race first. Use `/joinrace` first.",
        flags: 64,
      });
    }

    // Check if user already has a bet
    if (shared.bets[userId]) {
      const existingBet = shared.bets[userId];
      return interaction.reply({
        content: `❌ You already placed a bet on **${existingBet.horse.name}** for 🥕 ${existingBet.amount.toLocaleString()}!\n\nUse \`EXIT RACE\` button to cancel and refund your bet first.`,
        flags: 64,
      });
    }

    if (shared.isAfterDeparture() || shared.raceClosed) {
      return interaction.reply({
        content: "❌ Betting closed.",
        flags: 64,
      });
    }

    const horseId = interaction.options.getInteger("horse");
    const amount = interaction.options.getInteger("amount");
    const horse = shared.horses.find((h) => h.id === horseId);

    if (!horse) {
      return interaction.reply({
        content: "❌ Invalid horse ID.",
        flags: 64,
      });
    }

    if (amount <= 0) {
      return interaction.reply({
        content: "❌ Amount must be greater than 0.",
        flags: 64,
      });
    }

    if (user.balance < amount) {
      return interaction.reply({
        content: `❌ Not enough carrats! You have 🥕 ${user.balance.toLocaleString()}`,
        flags: 64,
      });
    }

    // Place the bet
    user.balance -= amount;
    shared.bets[userId] = { horse, amount, horseId: horse.id };
    shared.saveUsers();
    shared.saveBets();

    const potentialWin = Math.floor(amount * horse.odds);

    return interaction.reply({
      content:
        `✅ **Bet placed!**\n\n` +
        `🐎 **Horse:** ${horse.name}\n` +
        `💰 **Amount:** 🥕 ${amount.toLocaleString()}\n` +
        `📈 **Odds:** ${horse.odds}x\n` +
        `🏆 **Potential Win:** 🥕 ${potentialWin.toLocaleString()}\n\n` +
        `Remaining balance: 🥕 ${user.balance.toLocaleString()}`,
      flags: 64,
    });
  },
};
