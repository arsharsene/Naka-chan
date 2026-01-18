module.exports = {
  name: "simrace_bet_dismiss",
  async execute(interaction) {
    // Simply delete/dismiss the ephemeral message
    await interaction.update({
      content: "❌ Bet cancelled.",
      embeds: [],
      components: [],
    });
    
    // Auto delete after 1 second
    setTimeout(async () => {
      try {
        await interaction.deleteReply();
      } catch (e) {}
    }, 1000);
  },
};
