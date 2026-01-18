module.exports = {
  name: "bet_close",
  async execute(interaction) {
    try {
      await interaction.deferUpdate();
      await interaction.deleteReply();
    } catch (e) {
      // Message might already be deleted
      await interaction.reply({
        content: "✅ Closed!",
        flags: 64,
      }).catch(() => {});
    }
  },
};
