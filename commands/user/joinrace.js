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

    const embed = new EmbedBuilder()
      .setColor(0x1abc9c)
      .setTitle(`🏁 ${raceName} · ${rd.grade}`)
      .setDescription(
        `📍 **${rd.venue} ${rd.raceNo}**\n` +
        `📅 **${rd.date}**\n` +
        `🕒 **Departure:** ${rd.departure}\n` +
        `${shared.countdown()}\n` +
        `📏 **Distance:** ${rd.distance}\n\n`
      )
      .addFields({
        name: "🐎 Horses & Odds",
        value: shared.horses
          .map((h) => `\`${h.id}\` **${h.name}** — **${h.odds}x**`)
          .join("\n"),
      })
      .setFooter({ text: "Join to access betting dashboard" });

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
