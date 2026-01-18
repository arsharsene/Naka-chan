const shared = require("../shared");
const { placeBet } = require("./bet_amount_100");

module.exports = {
  name: "bet_amount_all",
  async execute(interaction) {
    const user = shared.getUser(interaction.user.id);
    await placeBet(interaction, user.balance);
  },
};
