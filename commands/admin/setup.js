const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder
} = require("discord.js");
const shared = require("../shared");

module.exports = {
  name: "setup",
  adminOnly: false, // Uses permission check instead
  async execute(interaction) {
    // Check for Manage Server permission or super admin
    const hasPermission = 
      interaction.user.id === process.env.ADMIN_ID ||
      interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild);

    if (!hasPermission) {
      return interaction.reply({
        content: "❌ You need **Manage Server** permission to use this command.",
        flags: 64,
      });
    }

    const guildId = interaction.guildId;
    const settings = shared.getGuildSettings(guildId);

    // Build admin list display
    let adminList = "No bot admins configured";
    if (settings.admins.length > 0) {
      const adminMentions = settings.admins.map(id => `<@${id}>`);
      adminList = adminMentions.join("\n");
    }

    // Build channel list display
    let channelList = "All channels (no restrictions)";
    if (settings.allowedChannels.length > 0) {
      const channelMentions = settings.allowedChannels.map(id => `<#${id}>`);
      channelList = channelMentions.join("\n");
    }

    // Announcer settings display
    const gamblerRole = settings.gamblerRoleId ? `<@&${settings.gamblerRoleId}>` : "*Not set*";
    const announceChannel = settings.announcementChannelId ? `<#${settings.announcementChannelId}>` : "*Not set*";

    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setAuthor({ 
        name: "⚙️ Server Setup Dashboard",
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTitle(`🔧 ${interaction.guild.name}`)
      .setDescription(
        `Configure Naka-chan Bot for this server.\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      )
      .addFields(
        {
          name: "👑 Bot Admins",
          value: 
            `*Users who can manage races & horses*\n\n` +
            adminList,
          inline: true,
        },
        {
          name: "📺 Allowed Channels",
          value:
            `*Where bot commands work*\n\n` +
            channelList,
          inline: true,
        }
      )
      .addFields({
        name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        value: "**📢 RACE ANNOUNCEMENTS**",
        inline: false,
      })
      .addFields(
        {
          name: "🎰 Gambler Role",
          value: gamblerRole,
          inline: true,
        },
        {
          name: "📣 Announce Channel",
          value: announceChannel,
          inline: true,
        }
      )
      .addFields({
        name: "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        value: 
          `**Status:** ${settings.setupComplete ? "✅ Setup Complete" : "⚠️ Setup Incomplete"}\n\n` +
          `Use the buttons below to manage settings.`,
        inline: false,
      })
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      .setFooter({ text: "Server Setup • Naka-chan Bot" })
      .setTimestamp();

    // Row 1: Admin management
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("setup_add_admin")
        .setLabel("➕ Add Admin")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("setup_remove_admin")
        .setLabel("➖ Remove Admin")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(settings.admins.length === 0)
    );

    // Row 2: Channel management
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("setup_add_channel")
        .setLabel("📺 Add Channel")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("setup_remove_channel")
        .setLabel("🚫 Remove Channel")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(settings.allowedChannels.length === 0),
      new ButtonBuilder()
        .setCustomId("setup_clear_channels")
        .setLabel("🔓 Allow All")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(settings.allowedChannels.length === 0)
    );

    // Row 3: Announcer settings
    const row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("setup_set_gambler_role")
        .setLabel("🎰 Set Gambler Role")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("setup_set_announce_channel")
        .setLabel("📣 Set Announce Channel")
        .setStyle(ButtonStyle.Primary)
    );

    // Row 4: Complete setup
    const row4 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("setup_complete")
        .setLabel("✅ Mark Setup Complete")
        .setStyle(ButtonStyle.Success)
        .setDisabled(settings.setupComplete),
      new ButtonBuilder()
        .setCustomId("setup_refresh")
        .setLabel("🔄 Refresh")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row1, row2, row3, row4],
      flags: 64,
    });
  },
};
