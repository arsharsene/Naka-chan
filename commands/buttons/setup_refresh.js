const setupCommand = require("../admin/setup");

module.exports = {
  name: "setup_refresh",
  async execute(interaction) {
    await setupCommand.execute(interaction);
  },
};
