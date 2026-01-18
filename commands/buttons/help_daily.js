const shared = require("../shared");

module.exports = {
  name: "help_daily",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (user.lastDaily && now - user.lastDaily < oneDay) {
      const remaining = shared.dailyRemaining(user);
      return interaction.reply({
        content: `⏰ Daily already claimed! Come back in **${remaining}**`,
        flags: 64,
      });
    }

    user.balance += 100;
    user.lastDaily = now;
    shared.saveUsers();

    await interaction.reply({
      content: `🎁 **Daily claimed!**\n+🥕 100 carrats\n\nNew balance: 🥕 **${user.balance.toLocaleString()}**`,
      flags: 64,
    });

    // Auto-dismiss after 15 seconds
    setTimeout(async () => {
      try { await interaction.deleteReply(); } catch (e) {}
    }, 15000);
  },
};
