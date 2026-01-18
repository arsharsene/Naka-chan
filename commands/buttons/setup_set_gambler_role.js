const { ActionRowBuilder, RoleSelectMenuBuilder } = require("discord.js");

module.exports = {
  name: "setup_set_gambler_role",
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new RoleSelectMenuBuilder()
        .setCustomId("setup_select_gambler_role")
        .setPlaceholder("Select the Gambler role to mention")
        .setMinValues(1)
        .setMaxValues(1)
    );

    await interaction.reply({
      content: "🎰 Select the role to mention for race announcements:",
      components: [row],
      flags: 64,
    });
  },
};
