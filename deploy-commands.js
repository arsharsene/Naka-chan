require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

const commands = [
  // ================= MAIN RACE BOARD =================
  new SlashCommandBuilder()
    .setName("joinrace")
    .setDescription("Join with see race details and horse list"),

  // ================= USER COMMANDS =================
  new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your carrats"),

  new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim daily 100 carrats"),

  new SlashCommandBuilder()
    .setName("bet")
    .setDescription("Place a bet")
    .addIntegerOption((o) =>
      o.setName("horse").setDescription("Horse ID").setRequired(true)
    )
    .addIntegerOption((o) =>
      o.setName("amount").setDescription("Carrats").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("racedetails")
    .setDescription("View public race information"),

  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View top players"),

  new SlashCommandBuilder()
    .setName("mybets")
    .setDescription("View your betting history"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show user dashboard and help"),

  // ================= ADMIN =================
  // ================= SET RACE =================
  new SlashCommandBuilder()
    .setName("setracedetail")
    .setDescription("ADMIN: Update race details")
    .addStringOption((o) =>
      o.setName("date").setDescription("Race date").setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("venue").setDescription("Venue / Track").setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("raceno")
        .setDescription("Race number (e.g. 11R)")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("grade").setDescription("Grade (G1, G2, G3)").setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("departure")
        .setDescription("Departure time (HH:MM)")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("weather").setDescription("Weather").setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("surface").setDescription("Surface").setRequired(false)
    )
    .addStringOption((o) =>
      o
        .setName("condition")
        .setDescription("Track condition")
        .setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("distance").setDescription("Distance").setRequired(false)
    ),

  // ================= SET WINNER =================
  new SlashCommandBuilder()
    .setName("setwinner")
    .setDescription("ADMIN: Set winning horse and payout")
    .addIntegerOption((option) =>
      option
        .setName("horse")
        .setDescription("Winning horse ID")
        .setRequired(true)
    ),

  // ================= SIM RACE =================
  new SlashCommandBuilder()
    .setName("admin")
    .setDescription("ADMIN: Show admin dashboard"),

  new SlashCommandBuilder()
    .setName("simrace")
    .setDescription("ADMIN: Start simulation race"),

  new SlashCommandBuilder()
    .setName("simbet")
    .setDescription("Place bet on simulation race")
    .addIntegerOption((o) =>
      o.setName("horse").setDescription("Horse ID").setRequired(true)
    )
    .addIntegerOption((o) =>
      o.setName("amount").setDescription("Carrats").setRequired(true)
    ),

  // ================= HORSE MANAGEMENT =================
  new SlashCommandBuilder()
    .setName("sethorse")
    .setDescription("ADMIN: Add or update a horse")
    .addIntegerOption((o) =>
      o.setName("id").setDescription("Horse ID (1-99)").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("name").setDescription("Horse name").setRequired(true)
    )
    .addNumberOption((o) =>
      o.setName("odds").setDescription("Betting odds (e.g. 2.5)").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("removehorse")
    .setDescription("ADMIN: Remove a horse")
    .addIntegerOption((o) =>
      o.setName("id").setDescription("Horse ID to remove").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("setracename")
    .setDescription("ADMIN: Set the race name")
    .addStringOption((o) =>
      o.setName("name").setDescription("Race name").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("listhorses")
    .setDescription("ADMIN: List all configured horses"),

  // ================= SIM RACE MANAGEMENT =================
  new SlashCommandBuilder()
    .setName("simsethorse")
    .setDescription("ADMIN: Add or update a sim horse")
    .addIntegerOption((o) =>
      o.setName("id").setDescription("Horse ID (1-99)").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("name").setDescription("Horse name").setRequired(true)
    )
    .addNumberOption((o) =>
      o.setName("odds").setDescription("Betting odds").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("simremovehorse")
    .setDescription("ADMIN: Remove a sim horse")
    .addIntegerOption((o) =>
      o.setName("id").setDescription("Horse ID to remove").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("simsetrace")
    .setDescription("ADMIN: Set sim race details")
    .addStringOption((o) =>
      o.setName("name").setDescription("Race name").setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("venue").setDescription("Venue").setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("distance").setDescription("Distance").setRequired(false)
    )
    .addStringOption((o) =>
      o.setName("condition").setDescription("Track condition").setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("simlisthorses")
    .setDescription("ADMIN: List all sim horses"),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup bot admins and allowed channels for this server"),

  // ================= NETKEIBA SCRAPER =================
  new SlashCommandBuilder()
    .setName("importrace")
    .setDescription("ADMIN: Import race data from netkeiba.com")
    .addStringOption((o) =>
      o
        .setName("url")
        .setDescription("Netkeiba race URL (e.g., https://en.netkeiba.com/race/shutuba.html?race_id=...)")
        .setRequired(true)
    ),

  // ================= SAY COMMAND =================
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("ADMIN: Make the bot say something")
    .addStringOption((o) =>
      o
        .setName("message")
        .setDescription("The message you want the bot to say")
        .setRequired(true)
    )
    .addChannelOption((o) =>
      o
        .setName("channel")
        .setDescription("Channel to send the message (optional)")
        .setRequired(false)
    ),

  // ================= CLEAN COMMAND =================
  new SlashCommandBuilder()
    .setName("clean")
    .setDescription("ADMIN: Delete messages in channel")
    .addIntegerOption((o) =>
      o
        .setName("amount")
        .setDescription("Number of messages to delete (1-100)")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
];

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands.map((cmd) => cmd.toJSON()) }
    );

    console.log("✅ Slash commands registered successfully");
  } catch (err) {
    console.error("❌ Failed to register commands:", err);
  }
})();
