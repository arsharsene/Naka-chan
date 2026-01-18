const shared = require("../shared");

module.exports = {
  name: "exit",
  async execute(interaction) {
    const userId = interaction.user.id;

    // Remove user from race and delete their bet
    shared.joinedUsers.delete(userId);
    
    // Refund the bet if exists
    const bet = shared.bets[userId];
    if (bet) {
      const user = shared.getUser(userId);
      user.balance += bet.amount;
      shared.saveUsers();
      delete shared.bets[userId];
      shared.saveBets();
    }

    // Delete the message
    try {
      await interaction.deferUpdate();
      await interaction.deleteReply();
    } catch (e) {
      // If can't delete, just reply
      await interaction.reply({
        content: "🚪 **Dashboard closed.** You have exited the race." + (bet ? ` Your bet of 🥕 ${bet.amount} has been refunded.` : ""),
        flags: 64,
      }).catch(() => {});
    }
  },
};
