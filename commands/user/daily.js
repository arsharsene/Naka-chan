const shared = require("../shared");

module.exports = {
  name: "daily",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);
    const now = Date.now();

    if (user.lastDaily) {
      const diff = now - user.lastDaily;

      if (diff < 24 * 60 * 60 * 1000) {
        return interaction.reply({
          content: `⏳ Daily already claimed.\nCome back in **${shared.dailyRemaining(user)}**.`,
          ephemeral: true,
        });
      }

      if (diff > 48 * 60 * 60 * 1000) {
        user.dailyStreak = 0;
      }
    }

    user.dailyStreak = (user.dailyStreak || 0) + 1;
    user.lastDaily = now;

    let reward = 100;
    if (user.dailyStreak % 5 === 0) {
      reward += 100;
    }

    user.balance += reward;
    shared.saveUsers();

    return interaction.reply({
      content:
        `🥕 **Daily Reward Claimed!**\n\n` +
        `💰 +${reward} carrats\n` +
        `🔥 Streak: **${user.dailyStreak} days**\n` +
        `🏦 Balance: **${user.balance}**`,
      ephemeral: true,
    });
  },
};
