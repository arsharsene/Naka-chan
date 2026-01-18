const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "help",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);
    const rd = shared.raceDetail;
    const raceName = rd.raceName || "Race";

    // Main Dashboard Embed - matching admin panel style
    const embed = new EmbedBuilder()
      .setColor(0x667eea)
      .setAuthor({ 
        name: "🐎 Naka-chan Bot", 
        iconURL: interaction.client.user.displayAvatarURL() 
      })
      .setTitle("📖 User Dashboard")
      .setDescription(
        `Welcome back, **${interaction.user.username}**!\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      )
      .addFields(
        {
          name: `🏇 Current Or Incoming Race`,
          value:
            `**Race:** ${raceName}\n` +
            `**Venue:** ${rd.venue || "—"} ${rd.raceNo || ""}\n` +
            `**Departure:** ${rd.departure || "—"} • ${rd.grade || ""}\n` +
            `**Countdown:** ${shared.countdown()}`,
          inline: true,
        },
        {
          name: "💰 Your Wallet",
          value:
            `**Balance:** 🥕 ${user.balance.toLocaleString()} carrats\n` +
            `**Daily:** ${user.lastDaily ? "✅ Claimed" : "🎁 Available!"}\n` +
            `**Status:** 🟢 Active`,
          inline: true,
        }
      )
      .addFields(
        {
          name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          value: "**🎰 BETTING COMMANDS**",
          inline: false,
        },
        {
          name: "🏇 Race Betting",
          value:
            "`/joinrace` - View race & horses\n" +
            "`/bet <horse> <amount>` - Place bet\n" +
            "`/mybets` - Your betting history",
          inline: true,
        },
        {
          name: "🎲 Simulation - Virtual Race",
          value:
            "`/simbet <horse> <amount>` - Simulation betting race\n",
          inline: true,
        }
      )
      .addFields(
        {
          name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
          value: "**💰 ECONOMY COMMANDS**",
          inline: false,
        },
        {
          name: "🏦 Balance",
          value:
            "`/balance` - Check carrats\n" +
            "`/daily` - Claim daily reward\n" +
            "`/leaderboard` - Top players",
          inline: true,
        },
        {
          name: "📊 Information",
          value:
            "`/racedetails` - Race info\n" +
            "`/help` - This dashboard\n" +
            "━━━━━━━━━━━━━━━━━━",
          inline: true,
        }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "🍀 Good luck with your bets! • Naka-chan Bot" })
      .setTimestamp();

    // Quick action buttons - matching admin panel style
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("help_racedetails")
        .setLabel("🏇 Race Details")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("help_balance")
        .setLabel("💰 Balance")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("help_daily")
        .setLabel("🎁 Daily")
        .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("help_leaderboard")
        .setLabel("🏆 Leaderboard")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("help_mybets")
        .setLabel("📋 My Bets")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("help_close")
        .setLabel("❌ Close")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2],
      flags: 64,
    });
  },
};
