require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});
client.commands = new Collection();
client.buttons = new Collection();

const ADMIN_ID = process.env.ADMIN_ID;

// ================= LOAD COMMANDS =================
const commandFolders = ["user", "admin"];
let commandCount = 0;

for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, "commands", folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
    commandCount++;
  }
}

// ================= LOAD BUTTONS =================
const buttonsPath = path.join(__dirname, "commands", "buttons");
const buttonFiles = fs.readdirSync(buttonsPath).filter((file) => file.endsWith(".js"));

for (const file of buttonFiles) {
  const button = require(path.join(buttonsPath, file));
  client.buttons.set(button.name, button);
}

console.log(`✅ Loaded ${commandCount} commands, ${buttonFiles.length} buttons`);

// ================= READY =================
client.once("ready", () => {
  console.log("🐎 Horse betting bot online");
  client.user.setPresence({
    activities: [{ name: "Watching Uma Musume", type: 3 }],
    status: "online",
  });
  
  // Start race announcer
  const { startAnnouncer } = require("./announcer");
  startAnnouncer(client);
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async (interaction) => {
  // ---------- SLASH COMMANDS ----------
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    // Admin check
    if (command.adminOnly && interaction.user.id !== ADMIN_ID) {
      return interaction.reply({
        content: "❌ Admin only command.",
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      // Only try to reply if we haven't already
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ There was an error executing this command.",
          flags: 64,
        }).catch(() => {});
      }
    }
  }

  // ---------- BUTTONS ----------
  if (interaction.isButton()) {
    const button = client.buttons.get(interaction.customId);

    if (!button) return;

    try {
      await button.execute(interaction);
    } catch (error) {
      console.error(`Error executing button ${interaction.customId}:`, error);
      // Only try to reply if we haven't already
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ There was an error processing this button.",
          flags: 64,
        }).catch(() => {});
      }
    }
  }

  // ---------- SELECT MENUS ----------
  if (interaction.isUserSelectMenu() || interaction.isChannelSelectMenu() || interaction.isStringSelectMenu() || interaction.isRoleSelectMenu()) {
    const shared = require("./commands/shared");
    const customId = interaction.customId;

    try {
      // User select for adding admin
      if (customId === "setup_select_admin") {
        const userId = interaction.values[0];
        shared.addGuildAdmin(interaction.guildId, userId);
        await interaction.reply({
          content: `✅ <@${userId}> has been added as a bot admin!`,
          flags: 64,
        });
      }

      // String select for removing admin
      else if (customId === "setup_deselect_admin") {
        const userId = interaction.values[0];
        shared.removeGuildAdmin(interaction.guildId, userId);
        await interaction.reply({
          content: `✅ <@${userId}> has been removed as a bot admin.`,
          flags: 64,
        });
      }

      // Channel select for adding channel
      else if (customId === "setup_select_channel") {
        const channelId = interaction.values[0];
        shared.addAllowedChannel(interaction.guildId, channelId);
        await interaction.reply({
          content: `✅ <#${channelId}> has been added to allowed channels!`,
          flags: 64,
        });
      }

      // String select for removing channel
      else if (customId === "setup_deselect_channel") {
        const channelId = interaction.values[0];
        shared.removeAllowedChannel(interaction.guildId, channelId);
        await interaction.reply({
          content: `✅ <#${channelId}> has been removed from allowed channels.`,
          flags: 64,
        });
      }

      // Role select for gambler role
      else if (customId === "setup_select_gambler_role") {
        const roleId = interaction.values[0];
        shared.setGamblerRole(interaction.guildId, roleId);
        await interaction.reply({
          content: `✅ <@&${roleId}> will be mentioned for race announcements!`,
          flags: 64,
        });
      }

      // Channel select for announcement channel
      else if (customId === "setup_select_announce_channel") {
        const channelId = interaction.values[0];
        shared.setAnnouncementChannel(interaction.guildId, channelId);
        await interaction.reply({
          content: `✅ Race announcements will be sent to <#${channelId}>!`,
          flags: 64,
        });
      }

      // Horse selection for betting
      else if (customId === "bet_select_horse") {
        // Check if user already has a bet
        const existingBet = shared.bets[interaction.user.id];
        if (existingBet) {
          const potentialWin = Math.floor(existingBet.amount * existingBet.horse.odds);
          return interaction.reply({
            content: 
              `❌ **You already have an active bet!**\n\n` +
              `🐎 **Horse:** ${existingBet.horse.name}\n` +
              `💰 **Amount:** 🥕 ${existingBet.amount.toLocaleString()}\n` +
              `📈 **Odds:** ${existingBet.horse.odds}x\n` +
              `🏆 **Potential Win:** 🥕 ${potentialWin.toLocaleString()}\n\n` +
              `Use \`EXIT RACE\` button to cancel and refund your bet first.`,
            flags: 64,
          });
        }

        const horseId = parseInt(interaction.values[0]);
        const horse = shared.horses.find((h) => h.id === horseId);

        if (!horse) {
          return interaction.reply({
            content: "❌ Horse not found.",
            flags: 64,
          });
        }

        // Store selected horse temporarily
        if (!shared.pendingBets) shared.pendingBets = {};
        shared.pendingBets[interaction.user.id] = { horseId };

        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
        const user = shared.getUser(interaction.user.id);

        const embed = new EmbedBuilder()
          .setColor(0x2ecc71)
          .setTitle(`🐎 ${horse.name}`)
          .setDescription(
            `**Odds:** ${horse.odds}x\n` +
            `**Your Balance:** 🥕 ${user.balance.toLocaleString()}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Select an amount or use \`/bet horse:${horse.id} amount:<carrats>\``
          )
          .setFooter({ text: `Horse ID: ${horse.id}` });

        const amountRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("bet_amount_100")
            .setLabel("🥕 100")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(user.balance < 100),
          new ButtonBuilder()
            .setCustomId("bet_amount_500")
            .setLabel("🥕 500")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(user.balance < 500),
          new ButtonBuilder()
            .setCustomId("bet_amount_1000")
            .setLabel("🥕 1000")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(user.balance < 1000),
          new ButtonBuilder()
            .setCustomId("bet_amount_all")
            .setLabel("🎯 ALL IN")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(user.balance < 1)
        );

        await interaction.reply({
          embeds: [embed],
          components: [amountRow],
          flags: 64,
        });
      }

      // Simrace horse selection
      else if (customId === "simrace_select_horse") {
        const horseId = parseInt(interaction.values[0]);
        const horse = shared.simHorses.find((h) => h.id === horseId);

        if (!horse) {
          return interaction.reply({
            content: "❌ Horse not found.",
            flags: 64,
          });
        }

        // Check if sim race is still active
        if (!shared.simRaceActive) {
          return interaction.reply({
            content: "❌ The race has already started!",
            flags: 64,
          });
        }

        // Store selected horse temporarily
        if (!shared.simPendingBets) shared.simPendingBets = {};
        shared.simPendingBets[interaction.user.id] = { horseId };

        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
        const user = shared.getUser(interaction.user.id);

        const embed = new EmbedBuilder()
          .setColor(0x9b59b6)
          .setTitle(`🎰 Betting on: ${horse.name}`)
          .setDescription(
            `**Odds:** ${horse.odds}x\n` +
            `**Your Balance:** 🥕 ${user.balance.toLocaleString()}\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Select your bet amount:`
          )
          .setFooter({ text: `Simulation Race • Horse #${horse.id}` });

        const amountRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("simbet_amount_100")
            .setLabel("🥕 100")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(user.balance < 100),
          new ButtonBuilder()
            .setCustomId("simbet_amount_500")
            .setLabel("🥕 500")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(user.balance < 500),
          new ButtonBuilder()
            .setCustomId("simbet_amount_1000")
            .setLabel("🥕 1000")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(user.balance < 1000),
          new ButtonBuilder()
            .setCustomId("simbet_amount_all")
            .setLabel("🎯 ALL IN")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(user.balance < 1)
        );

        await interaction.reply({
          embeds: [embed],
          components: [amountRow],
          flags: 64,
        });
      }

      // Admin horse edit selection
      else if (customId === "admin_select_horse_edit") {
        const horseId = parseInt(interaction.values[0]);
        const horse = shared.horses.find((h) => h.id === horseId);

        if (!horse) {
          return interaction.reply({
            content: "❌ Horse not found.",
            flags: 64,
          });
        }

        // Show modal for editing odds and fav
        const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
        
        const modal = new ModalBuilder()
          .setCustomId(`edit_horse_modal_${horseId}`)
          .setTitle(`Edit: ${horse.name}`);

        const oddsInput = new TextInputBuilder()
          .setCustomId("odds_input")
          .setLabel("Odds (e.g., 5.5)")
          .setStyle(TextInputStyle.Short)
          .setValue(horse.odds.toString())
          .setPlaceholder("Enter new odds")
          .setRequired(true);

        const favInput = new TextInputBuilder()
          .setCustomId("fav_input")
          .setLabel("Favorite Rank (1-20)")
          .setStyle(TextInputStyle.Short)
          .setValue(horse.fav.toString())
          .setPlaceholder("Enter favorite rank")
          .setRequired(true);

        modal.addComponents(
          new ActionRowBuilder().addComponents(oddsInput),
          new ActionRowBuilder().addComponents(favInput)
        );

        await interaction.showModal(modal);
      }
    } catch (error) {
      console.error(`Error handling select menu ${customId}:`, error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: "❌ There was an error processing your selection.",
          flags: 64,
        }).catch(() => {});
      }
    }
  }
});

// ================= MODAL SUBMIT HANDLER =================
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isModalSubmit()) return;

  const shared = require("./commands/shared");
  const customId = interaction.customId;

  // Handle horse edit modal
  if (customId.startsWith("edit_horse_modal_")) {
    const horseId = parseInt(customId.replace("edit_horse_modal_", ""));
    const horse = shared.horses.find((h) => h.id === horseId);

    if (!horse) {
      return interaction.reply({
        content: "❌ Horse not found.",
        flags: 64,
      });
    }

    const oddsInput = interaction.fields.getTextInputValue("odds_input");
    const favInput = interaction.fields.getTextInputValue("fav_input");

    const newOdds = parseFloat(oddsInput);
    const newFav = parseInt(favInput);

    // Validate inputs
    if (isNaN(newOdds) || newOdds <= 0 || newOdds > 1000) {
      return interaction.reply({
        content: "❌ Invalid odds. Please enter a number between 0.1 and 1000.",
        flags: 64,
      });
    }

    if (isNaN(newFav) || newFav < 1 || newFav > 20) {
      return interaction.reply({
        content: "❌ Invalid favorite rank. Please enter a number between 1 and 20.",
        flags: 64,
      });
    }

    // Update horse
    const oldOdds = horse.odds;
    const oldFav = horse.fav;
    horse.odds = newOdds;
    horse.fav = newFav;
    shared.saveHorses();

    await interaction.reply({
      content: `✅ **Horse Updated!**\n\n` +
        `**${horse.name}**\n` +
        `Odds: ${oldOdds}x → **${newOdds}x**\n` +
        `Fav: ${oldFav} → **${newFav}**`,
      flags: 64,
    });
  }
});

// ================= BOT MENTION RESPONSE =================
client.on("messageCreate", async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  // Check for help questions
  const helpKeywords = [
    "gimana cara pakainya",
    "gimana cara pakai",
    "cara pakai",
    "how to use",
    "cara pakainya",
    "gimana pakenya",
    "cara pake",
  ];

  const isHelpQuestion = helpKeywords.some((keyword) => content.includes(keyword));

  if (isHelpQuestion) {
    const { EmbedBuilder } = require("discord.js");
    
    const helpEmbed = new EmbedBuilder()
      .setColor(0x3498db)
      .setTitle("📖 Cara Pakai Bot")
      .setDescription("Berikut adalah daftar command yang tersedia:")
      .addFields(
        { name: "🎰 **Betting Commands**", value: 
          "`/joinrace` - Lihat detail race dan daftar kuda\n" +
          "`/bet <horse> <amount>` - Pasang taruhan\n" +
          "`/simbet <horse> <amount>` - Taruhan di simulation race\n" +
          "`/mybets` - Lihat history taruhan kamu"
        },
        { name: "💰 **Balance Commands**", value:
          "`/balance` - Cek jumlah carrats kamu\n" +
          "`/daily` - Klaim 100 carrats harian\n" +
          "`/leaderboard` - Lihat top players"
        },
        { name: "📊 **Info Commands**", value:
          "`/racedetails` - Lihat informasi race"
        }
      )
      .setFooter({ text: "🐎 Good luck with your bets!" });

    await message.reply({ embeds: [helpEmbed] });
    return;
  }

  // Check if the bot was mentioned
  if (message.mentions.has(client.user)) {
    await message.reply("apa tag-tag gw? lu mau judi? sini serahin carrats lo! ketik /joinrace untuk juday");
  }
});

client.login(process.env.BOT_TOKEN);