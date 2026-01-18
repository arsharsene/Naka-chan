const shared = require("../shared");

module.exports = {
  name: "balance",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);
    
    await interaction.reply({
      content: `💰 **Your Balance**\n🥕 Carrats: **${user.balance}**`,
      flags: 64,
    });

    // Auto-dismiss after 5 seconds
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (e) {}
    }, 5000);
  },
};
