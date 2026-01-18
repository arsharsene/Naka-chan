const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "admin",
  adminOnly: true,
  async execute(interaction) {
    const rd = shared.raceDetail;
    const srd = shared.simRaceDetail;

    const mainEmbed = new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("🔧 Admin Dashboard")
      .setDescription(
        `Welcome, **${interaction.user.username}**!\n` +
        `Here's your control panel for managing races.\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      )
      .addFields(
        {
          name: "🏇 Main Race Status",
          value: 
            `**Race:** ${rd.raceName || "Not Set"}\n` +
            `**Venue:** ${rd.venue || "—"} ${rd.raceNo || ""}\n` +
            `**Date:** ${rd.date || "—"}\n` +
            `**Departure:** ${rd.departure || "—"}\n` +
            `**Horses:** ${shared.horses.length}\n` +
            `**Status:** ${shared.raceClosed ? "🔴 Closed" : "🟢 Open"}`,
          inline: true,
        },
        {
          name: "🎰 Sim Race Status",
          value:
            `**Race:** ${srd.raceName || "Simulation Cup"}\n` +
            `**Venue:** ${srd.venue || "Virtual Track"}\n` +
            `**Distance:** ${srd.distance || "—"}\n` +
            `**Condition:** ${srd.condition || "Good"}\n` +
            `**Horses:** ${shared.simHorses.length}\n` +
            `**Status:** ${shared.simRaceActive ? "🔴 Running" : "🟢 Ready"}`,
          inline: true,
        }
      )
      .addFields(
        {
          name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          value: "**📋 MAIN RACE COMMANDS**",
          inline: false,
        },
        {
          name: "🐎 Horse Management",
          value:
            "`/sethorse <id> <name> <odds>` - Add/update horse\n" +
            "`/removehorse <id>` - Remove horse\n" +
            "`/listhorses` - View all horses",
          inline: true,
        },
        {
          name: "🏁 Race Management",
          value:
            "`/setracedetail` - Set race info\n" +
            "`/setracename <name>` - Set race name\n" +
            "`/importrace <url>` - Import from netkeiba\n" +
            "`/setwinner <horse>` - Set winner & payout",
          inline: true,
        }
      )
      .addFields(
        {
          name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          value: "**🎰 SIMULATION RACE COMMANDS**",
          inline: false,
        },
        {
          name: "🐎 Sim Horse Management",
          value:
            "`/simsethorse <id> <name> <odds>` - Add/update\n" +
            "`/simremovehorse <id>` - Remove horse\n" +
            "`/simlisthorses` - View all sim horses",
          inline: true,
        },
        {
          name: "🎲 Sim Race Control",
          value:
            "`/simsetrace` - Set sim race details\n" +
            "`/simrace` - Start simulation race\n" +
            "━━━━━━━━━━━━━━━━━━",
          inline: true,
        }
      )
      .setFooter({ text: "🔐 Admin Only • Naka-chan Bot" })
      .setTimestamp();

    // Quick action buttons - Row 1
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin_listhorses")
        .setLabel("📋 Main Horses")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("admin_simlisthorses")
        .setLabel("🎰 Sim Horses")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("admin_refresh")
        .setLabel("🔄 Refresh")
        .setStyle(ButtonStyle.Success)
    );

    // Horse management buttons - Row 2
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("admin_refresh_odds")
        .setLabel("🔄 Refresh Odds")
        .setStyle(ButtonStyle.Primary)
        .setDisabled(!shared.raceDetail.netkeibaUrl), // Disabled if no URL
      new ButtonBuilder()
        .setCustomId("admin_edit_horse")
        .setLabel("✏️ Edit Horse")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(shared.horses.length === 0) // Disabled if no horses
    );

    await interaction.reply({
      embeds: [mainEmbed],
      components: [row1, row2],
      flags: 64,
    });
  },
};
