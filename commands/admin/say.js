module.exports = {
  name: "say",
  adminOnly: true,
  async execute(interaction) {
    const message = interaction.options.getString("message");
    const targetChannel = interaction.options.getChannel("channel") || interaction.channel;

    try {
      // Send the message to the target channel
      await targetChannel.send(message);

      // Reply to the admin (ephemeral so only they see it)
      await interaction.reply({
        content: `✅ Message sent to <#${targetChannel.id}>!`,
        flags: 64, // Ephemeral
      });
    } catch (error) {
      console.error("Error sending message:", error);
      await interaction.reply({
        content: `❌ Failed to send message: ${error.message}`,
        flags: 64,
      });
    }
  },
};
