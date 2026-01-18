const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "join",
  async execute(interaction) {
    if (shared.joinedUsers.has(interaction.user.id)) {
      return interaction.reply({
        content: "ℹ️ You already joined the race.",
        ephemeral: true,
      });
    }

    shared.joinedUsers.add(interaction.user.id);

    const bet = shared.bets[interaction.user.id];
    const user = shared.getUser(interaction.user.id);

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle("🎰 Betting Dashboard")
      .addFields(
        {
          name: "🥕 Balance",
          value: `${user.balance}`,
          inline: true,
        },
        {
          name: "🎯 Active Bet",
          value: bet ? `${bet.horse.name} · 🥕 ${bet.amount}` : "— none —",
          inline: true,
        },
        {
          name: "📍 Race Info",
          value:
            `🗺️ ${shared.raceDetail.venue} ${shared.raceDetail.raceNo}\n` +
            `📅 ${shared.raceDetail.date}\n` +
            `🕒 ${shared.raceDetail.departure}`,
          inline: false,
        },
        {
          name: "🐎 Horse Table",
          value: shared.horses
            .map((h) => `\`${h.id}\` ${h.name} — **${h.odds}x**`)
            .join("\n"),
        }
      )
      .setFooter({ text: "Use /bet or the BET button" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bet_help")
        .setLabel("BET")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("exit")
        .setLabel("EXIT RACE")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true,
    });
  },
};
