const { 
  ActionRowBuilder, 
  ChannelSelectMenuBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

module.exports = {
  name: "setup_add_channel",
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

    const row = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("setup_select_channel")
        .setPlaceholder("Select a channel to allow bot commands")
        .setChannelTypes(ChannelType.GuildText)
        .setMinValues(1)
        .setMaxValues(1)
    );

    await interaction.reply({
      content: "📺 **Select a channel where bot commands will work:**",
      components: [row],
      flags: 64,
    });
  },
};
