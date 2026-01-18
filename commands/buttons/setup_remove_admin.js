const { 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setup_remove_admin",
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

    if (settings.admins.length === 0) {
      return interaction.reply({
        content: "❌ No bot admins to remove.",
        flags: 64,
      });
    }

    const options = await Promise.all(
      settings.admins.map(async (id) => {
        try {
          const user = await interaction.client.users.fetch(id);
          return {
            label: user.username,
            value: id,
            description: `Remove ${user.username} as bot admin`,
          };
        } catch {
          return {
            label: `Unknown (${id})`,
            value: id,
            description: "Remove this user",
          };
        }
      })
    );

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("setup_deselect_admin")
        .setPlaceholder("Select an admin to remove")
        .addOptions(options)
    );

    await interaction.reply({
      content: "➖ **Select an admin to remove:**",
      components: [row],
      flags: 64,
    });
  },
};
