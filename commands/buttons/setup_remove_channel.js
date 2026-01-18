const { 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  PermissionFlagsBits
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setup_remove_channel",
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

    if (settings.allowedChannels.length === 0) {
      return interaction.reply({
        content: "❌ No channel restrictions to remove.",
        flags: 64,
      });
    }

    const options = settings.allowedChannels.map((id) => ({
      label: `#${interaction.guild.channels.cache.get(id)?.name || id}`,
      value: id,
      description: "Remove this channel from allowed list",
    }));

    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("setup_deselect_channel")
        .setPlaceholder("Select a channel to remove")
        .addOptions(options)
    );

    await interaction.reply({
      content: "🚫 **Select a channel to remove from allowed list:**",
      components: [row],
      flags: 64,
    });
  },
};
