const adminCommand = require("../admin/admin");

module.exports = {
  name: "admin_back",
  async execute(interaction) {
    // Check if admin
    if (interaction.user.id !== process.env.ADMIN_ID) {
      return interaction.reply({ content: "❌ Admin only.", flags: 64 });
    }

    // Execute the admin command to show the dashboard
    await adminCommand.execute(interaction);
  },
};
