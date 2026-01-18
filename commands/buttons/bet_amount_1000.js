const shared = require("../shared");
const { placeBet } = require("./bet_amount_100");

module.exports = {
  name: "bet_amount_1000",
  async execute(interaction) {
    await placeBet(interaction, 1000);
  },
};
