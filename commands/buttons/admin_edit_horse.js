const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder 
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "admin_edit_horse",
  async execute(interaction) {
    // Check if we have horses
    if (shared.horses.length === 0) {
      return interaction.reply({
        content: "❌ No horses to edit. Import a race first with `/importrace`.",
        flags: 64,
      });
    }

    // Build horse selection dropdown
    const horseOptions = shared.horses.slice(0, 25).map((h) => ({
      label: `#${h.id} ${h.name}`,
      description: `Odds: ${h.odds}x | Fav: ${h.fav}`,
      value: h.id.toString(),
    }));

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("admin_select_horse_edit")
        .setPlaceholder("🐎 Select a horse to edit...")
        .addOptions(horseOptions)
    );

    const embed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("✏️ Edit Horse")
      .setDescription(
        `Select a horse to edit its odds and favorite rank.\n\n` +
        `**Current Horses:**\n` +
        shared.horses.map(h => `\`#${h.id}\` ${h.name} — ${h.odds}x (fav ${h.fav})`).join("\n")
      )
      .setFooter({ text: "Select a horse to edit" });

    await interaction.reply({
      embeds: [embed],
      components: [selectRow],
      flags: 64,
    });
  },
};
