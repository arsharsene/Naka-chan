const { PermissionFlagsBits } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setup_complete",
  async execute(interaction) {
    const hasPermission = 
      interaction.user.id === process.env.ADMIN_ID ||
      interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);

    if (!hasPermission) {
      return interaction.reply({
        content: "❌ You need **Manage Server** permission.",
        flags: 64,
      });
    }

    shared.setSetupComplete(interaction.guildId, true);

    await interaction.reply({
      content: "✅ **Setup marked as complete!** Your server is now configured.",
      flags: 64,
    });
  },
};
