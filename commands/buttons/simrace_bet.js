const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "simrace_bet",
  async execute(interaction) {
    // Check if race is active
    if (!shared.simRaceActive) {
      return interaction.reply({
        content: "❌ No simulation race is currently open for betting.",
        flags: 64,
      });
    }

    // Check if user already bet
    if (shared.simBets[interaction.user.id]) {
      const existingBet = shared.simBets[interaction.user.id];
      const msg = await interaction.reply({
        content: `❌ You already bet **${existingBet.amount.toLocaleString()} 🥕** on **${existingBet.horse.name}**!`,
        flags: 64,
      });
      // Auto dismiss after 5 seconds
      setTimeout(async () => {
        try { await interaction.deleteReply(); } catch (e) {}
      }, 5000);
      return;
    }

    // Get user balance
    if (!shared.users[interaction.user.id]) {
      shared.users[interaction.user.id] = { balance: 1000, lastDaily: null };
      shared.saveUsers();
    }
    const user = shared.users[interaction.user.id];

    if (user.balance <= 0) {
      const msg = await interaction.reply({
        content: "❌ You have no balance! Use `/daily` to get coins.",
        flags: 64,
      });
      setTimeout(async () => {
        try { await interaction.deleteReply(); } catch (e) {}
      }, 5000);
      return;
    }

    // Build horse options
    const horseOptions = shared.simHorses.map((h) => ({
      label: `#${h.id} ${h.name}`,
      description: `Odds: ${h.odds}x`,
      value: h.id.toString(),
    }));

    const selectRow = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("simrace_select_horse")
        .setPlaceholder("🐎 Choose a horse to bet on...")
        .addOptions(horseOptions)
    );

    // Add dismiss button
    const dismissRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("simrace_bet_dismiss")
        .setLabel("❌ Cancel")
        .setStyle(ButtonStyle.Secondary)
    );

    const embed = new EmbedBuilder()
      .setColor(0x9b59b6)
      .setTitle("🎰 Place Your Bet!")
      .setDescription(
        `**Your Balance:** ${user.balance.toLocaleString()} 🥕\n\n` +
        `Select a horse below, then choose your bet amount.\n\n` +
        `**Available Horses:**\n` +
        shared.simHorses.map(h => `\`#${h.id}\` ${h.name} ─ \`${h.odds}x\``).join("\n") +
        `\n\n*This will auto-close in 30 seconds*`
      )
      .setFooter({ text: "Simulation Race • Good luck!" });

    await interaction.reply({
      embeds: [embed],
      components: [selectRow, dismissRow],
      flags: 64,
    });

    // Auto dismiss after 30 seconds if user doesn't act
    setTimeout(async () => {
      try { 
        await interaction.deleteReply(); 
      } catch (e) {
        // Message may already be deleted by user action
      }
    }, 30000);
  },
};
