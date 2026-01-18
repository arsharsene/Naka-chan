module.exports = {
  name: "help_close",
  async execute(interaction) {
    try {
      await interaction.deferUpdate();
      await interaction.deleteReply();
    } catch (e) {
      // Message might already be deleted or not deletable
      await interaction.reply({
        content: "✅ Closed!",
        flags: 64,
      }).catch(() => {});
    }
  },
};
