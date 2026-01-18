const { 
  ActionRowBuilder, 
  UserSelectMenuBuilder,
  PermissionFlagsBits
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setup_add_admin",
  async execute(interaction) {
    // Check for Manage Server permission
    const hasPermission = 
      interaction.user.id === process.env.ADMIN_ID ||
      interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);

    if (!hasPermission) {
      return interaction.reply({
        content: "❌ You need **Manage Server** permission.",
        flags: 64,
      });
    }

    const row = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("setup_select_admin")
        .setPlaceholder("Select a user to add as bot admin")
        .setMinValues(1)
        .setMaxValues(1)
    );

    await interaction.reply({
      content: "👑 **Select a user to add as bot admin:**",
      components: [row],
      flags: 64,
    });
  },
};
