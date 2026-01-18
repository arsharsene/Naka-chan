const { ActionRowBuilder, ChannelSelectMenuBuilder, ChannelType } = require("discord.js");

module.exports = {
  name: "setup_set_announce_channel",
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ChannelSelectMenuBuilder()
        .setCustomId("setup_select_announce_channel")
        .setPlaceholder("Select the announcement channel")
        .setChannelTypes(ChannelType.GuildText)
        .setMinValues(1)
        .setMaxValues(1)
    );

    await interaction.reply({
      content: "📣 Select the channel for race announcements (30 min before race):",
      components: [row],
      flags: 64,
    });
  },
};
