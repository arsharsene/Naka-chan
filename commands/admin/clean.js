module.exports = {
  name: "clean",
  adminOnly: true,
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    const channel = interaction.channel;

    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: "❌ Please specify a number between 1 and 100.",
        flags: 64,
      });
    }

    try {
      // Defer reply first since bulk delete might take a moment
      await interaction.deferReply({ flags: 64 });

      // Fetch and delete messages
      const messages = await channel.messages.fetch({ limit: amount });
      
      // Filter messages older than 14 days (Discord limitation)
      const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
      const deletable = messages.filter(msg => msg.createdTimestamp > twoWeeksAgo);
      const tooOld = messages.size - deletable.size;

      if (deletable.size === 0) {
        return interaction.editReply({
          content: "❌ No messages to delete. Messages older than 14 days cannot be bulk deleted.",
        });
      }

      const deleted = await channel.bulkDelete(deletable, true);

      let response = `✅ Deleted **${deleted.size}** message(s).`;
      if (tooOld > 0) {
        response += `\n⚠️ ${tooOld} message(s) were older than 14 days and couldn't be deleted.`;
      }

      await interaction.editReply({ content: response });

      // Auto-delete the reply after 5 seconds
      setTimeout(async () => {
        try {
          await interaction.deleteReply();
        } catch (e) {}
      }, 5000);

    } catch (error) {
      console.error("Error deleting messages:", error);
      
      if (interaction.deferred) {
        await interaction.editReply({
          content: `❌ Failed to delete messages: ${error.message}`,
        });
      } else {
        await interaction.reply({
          content: `❌ Failed to delete messages: ${error.message}`,
          flags: 64,
        });
      }
    }
  },
};
