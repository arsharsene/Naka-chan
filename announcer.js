const { EmbedBuilder } = require("discord.js");
const shared = require("./commands/shared");

let announcedRaces = new Set();
let announcerInterval = null;

/**
 * Check if race is starting soon and send announcement
 */
async function checkUpcomingRace(client) {
  const rd = shared.raceDetail;
  
  if (!rd.date || !rd.departure) return;
  
  // Parse race datetime
  const [day, month, year] = rd.date.split("/").map(Number);
  const [hours, minutes] = rd.departure.split(":").map(Number);
  
  const raceDate = new Date(year, month - 1, day, hours, minutes, 0, 0);
  const now = new Date();
  
  // Calculate time until race (in minutes)
  const diffMs = raceDate.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  // Check if race is 25-35 minutes away (announce at ~30 min mark)
  if (diffMins >= 25 && diffMins <= 35) {
    const raceKey = `${rd.date}_${rd.departure}_${rd.raceName}`;
    
    // Don't announce if already announced
    if (announcedRaces.has(raceKey)) return;
    
    // Mark as announced
    announcedRaces.add(raceKey);
    
    // Send announcements to all configured guilds
    for (const [guildId, settings] of Object.entries(shared.guilds || {})) {
      if (!settings.announcementChannelId) continue;
      
      try {
        const guild = client.guilds.cache.get(guildId);
        if (!guild) continue;
        
        const channel = guild.channels.cache.get(settings.announcementChannelId);
        if (!channel) continue;
        
        // Build role mention
        let roleMention = "";
        if (settings.gamblerRoleId) {
          roleMention = `<@&${settings.gamblerRoleId}> `;
        }
        
        const embed = new EmbedBuilder()
          .setColor(0xe74c3c)
          .setTitle("🏇 RACE STARTING SOON!")
          .setDescription(
            `**${rd.raceName}** (${rd.grade})\n\n` +
            `📍 **Venue:** ${rd.venue} ${rd.raceNo}\n` +
            `📅 **Date:** ${rd.date}\n` +
            `🕐 **Time:** ${rd.departure} WIB\n` +
            `📏 **Distance:** ${rd.distance}\n\n` +
            `⏰ **Race starts in ~${diffMins} minutes!**\n\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `🎰 Don't forget to place your bets!\n` +
            `Use \`/joinrace\` to see horses and bet!`
          )
          .setFooter({ text: "🐎 Good luck, gamblers!" })
          .setTimestamp();
        
        await channel.send({
          content: roleMention ? `${roleMention}Race reminder!` : undefined,
          embeds: [embed],
        });
        
        console.log(`📢 Sent race announcement to ${guild.name} #${channel.name}`);
      } catch (error) {
        console.error(`Failed to send announcement to guild ${guildId}:`, error.message);
      }
    }
  }
  
  // Clear old announced races (races that have passed)
  if (diffMs < -60 * 60 * 1000) { // More than 1 hour ago
    const raceKey = `${rd.date}_${rd.departure}_${rd.raceName}`;
    announcedRaces.delete(raceKey);
  }
}

/**
 * Start the announcer interval
 */
function startAnnouncer(client) {
  if (announcerInterval) {
    clearInterval(announcerInterval);
  }
  
  // Check every minute
  announcerInterval = setInterval(() => {
    checkUpcomingRace(client);
  }, 60 * 1000);
  
  // Also check immediately on start
  checkUpcomingRace(client);
  
  console.log("📢 Race announcer started (checking every minute)");
}

/**
 * Stop the announcer
 */
function stopAnnouncer() {
  if (announcerInterval) {
    clearInterval(announcerInterval);
    announcerInterval = null;
  }
}

module.exports = {
  startAnnouncer,
  stopAnnouncer,
  checkUpcomingRace,
};
