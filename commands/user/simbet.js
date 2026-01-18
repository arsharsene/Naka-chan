const shared = require("../shared");

module.exports = {
  name: "simbet",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);

    if (!shared.simRaceActive) {
      return interaction.reply({
        content: "❌ No active simulation race.",
        flags: 64,
      });
    }

    const horseId = interaction.options.getInteger("horse");
    const amount = interaction.options.getInteger("amount");
    
    // Use simHorses instead of horses
    const horse = shared.simHorses.find((h) => h.id === horseId);

    if (!horse) {
      return interaction.reply({ 
        content: `❌ No sim horse with ID \`${horseId}\`. Check /simlisthorses.`, 
        flags: 64 
      });
    }

    if (amount <= 0) {
      return interaction.reply({ content: "❌ Amount must be positive.", flags: 64 });
    }

    if (user.balance < amount) {
      return interaction.reply({ 
        content: `❌ Not enough carrats! You have 🥕 ${user.balance}`, 
        flags: 64 
      });
    }

    user.balance -= amount;
    shared.simBets[interaction.user.id] = { horse, amount };
    shared.saveUsers();

    return interaction.reply({
      content: `🎰 Sim bet placed!\n**Horse:** ${horse.name} (${horse.odds}x)\n**Bet:** 🥕 ${amount}\n**Potential win:** 🥕 ${Math.floor(amount * horse.odds)}`,
      flags: 64,
    });
  },
};
