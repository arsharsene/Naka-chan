module.exports = {
  name: "say",
  adminOnly: true,
  async execute(interaction) {
    const message = interaction.options.getString("message");
    const targetChannel = interaction.options.getChannel("channel") || interaction.channel;

    try {
      // Send the message to the target channel
      await targetChannel.send(message);

      // Silently acknowledge (no visible response)
      await interaction.deferReply({ flags: 64 });
      await interaction.deleteReply();
    } catch (error) {
      console.error("Error sending message:", error);
      await interaction.reply({
        content: `❌ Failed to send message: ${error.message}`,
        flags: 64,
      });
    }
  },
};
