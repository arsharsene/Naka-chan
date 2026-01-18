const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "bet_help",
  async execute(interaction) {
    if (!shared.joinedUsers.has(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You need to join the race first! Use `/joinrace`",
        flags: 64,
      });
    }

    const user = shared.getUser(interaction.user.id);
    const currentBet = shared.bets[interaction.user.id];

    // If user already has a bet, show their current bet instead
    if (currentBet) {
      const potentialWin = Math.floor(currentBet.amount * currentBet.horse.odds);
      return interaction.reply({
        content: 
          `❌ **You already have an active bet!**\n\n` +
          `🐎 **Horse:** ${currentBet.horse.name}\n` +
          `💰 **Amount:** 🥕 ${currentBet.amount.toLocaleString()}\n` +
          `📈 **Odds:** ${currentBet.horse.odds}x\n` +
          `🏆 **Potential Win:** 🥕 ${potentialWin.toLocaleString()}\n\n` +
          `Use \`EXIT RACE\` button to cancel and refund your bet first.`,
        flags: 64,
      });
    }

    // Create horse options for dropdown
    const horseOptions = shared.horses.map((h) => ({
      label: `#${h.id} ${h.name}`,
      value: String(h.id),
      description: `Odds: ${h.odds}x`,
      emoji: h.fav === 1 ? "⭐" : h.fav <= 3 ? "🔥" : "🐎",
    }));

    const embed = new EmbedBuilder()
      .setColor(0xf39c12)
      .setTitle("🎰 Place Your Bet")
      .setDescription(
        `**Your Balance:** 🥕 ${user.balance.toLocaleString()} carrats\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `**Step 1:** Select a horse below\n` +
        `**Step 2:** Choose bet amount`
      )
      .setFooter({ text: "Select a horse to see its details" });

    // Horse selection dropdown
    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("bet_select_horse")
        .setPlaceholder("🐎 Select a horse to bet on...")
        .addOptions(horseOptions)
    );

    // Amount preset buttons
    const amountRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bet_amount_100")
        .setLabel("🥕 100")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("bet_amount_500")
        .setLabel("🥕 500")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("bet_amount_1000")
        .setLabel("🥕 1000")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("bet_amount_all")
        .setLabel("🎯 ALL IN")
        .setStyle(ButtonStyle.Secondary)
    );

    // Exit button row
    const exitRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("bet_close")
        .setLabel("❌ Close")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
      embeds: [embed],
      components: [selectRow, amountRow, exitRow],
      flags: 64,
    });
  },
};
