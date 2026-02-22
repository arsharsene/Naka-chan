const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "joinrace",
  async execute(interaction) {
    if (shared.joinedUsers.has(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You already joined the race.",
        flags: 64,
      });
    }

    const rd = shared.raceDetail;
    const raceName = rd.raceName || "Race";

    const horseLines = [...shared.horses]
      .sort((a, b) => a.id - b.id)
      .map((h) => {
        const favBadge = h.fav === 1 ? "⭐ " : h.fav <= 3 ? "🔥 " : "";
        const favRank = h.fav ? `${h.fav}` : "";
        return `\`#${String(h.id).padStart(2, "0")}\` ${h.name} ─ \`${h.odds}x\` ─ ${favBadge}${favRank}`;
      })
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setAuthor({ name: `🏇 ${rd.venue || "—"} Racecourse` })
      .setTitle(`🏁 ${rd.raceNo || ""} ${raceName}`)
      .setDescription(
        `🏆 **Grade:** ${rd.grade || "—"}  ┃  📏 **${rd.distance}**\n` +
        `📅 **${rd.date}**  ┃  🕐 **${rd.departure}**\n` +
        `🌤️ **${rd.weather || "Sunny"}**   ┃  🌱 **${rd.condition || "Good"}**\n` +
        `─────────────────────────\n` +
        `**Countdown: ${shared.countdown()}**\n` +
        `─────────────────────────\n` +
        `**🐎 RUNNERS (${shared.horses.length})**\n` +
        `\ ID\ ─ Horse ─ \ Odds\ ─ Fav\n` +
        `─────────────────────────\n` +
        horseLines
      )
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .setFooter({ text: "Join to access betting dashboard • ⭐ Favorite • 🔥 Top 3" })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("join")
        .setLabel("JOIN RACE")
        .setStyle(ButtonStyle.Success)
        .setDisabled(shared.isAfterDeparture()),

      new ButtonBuilder()
        .setCustomId("exit")
        .setLabel("EXIT")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
      embeds: [embed],
      components: [row],
      flags: 64,
    });
  },
};
