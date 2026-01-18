const { PermissionFlagsBits } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setup_clear_channels",
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

    const settings = shared.getGuildSettings(interaction.guildId);
    settings.allowedChannels = [];
    shared.saveGuildSettings();

    await interaction.reply({
      content: "✅ **Channel restrictions cleared!** Bot commands now work in all channels.",
      flags: 64,
    });
  },
};
