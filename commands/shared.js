const fs = require("fs");
const path = require("path");

// ================= FILES =================
const raceFile = path.join(__dirname, "..", "data", "race.json");
const userFile = path.join(__dirname, "..", "data", "users.json");
const horsesFile = path.join(__dirname, "..", "data", "horses.json");
const simRaceFile = path.join(__dirname, "..", "data", "sim_race.json");
const simHorsesFile = path.join(__dirname, "..", "data", "sim_horses.json");
const guildsFile = path.join(__dirname, "..", "data", "guilds.json");
const betsFile = path.join(__dirname, "..", "data", "bets.json");

// ================= CONFIG =================
const START_BALANCE = 1000;

// ================= DEFAULT DATA =================
const defaultRaceDetail = {
  date: "Sunday, December 28, 2025",
  venue: "Nakayama",
  raceNo: "11R",
  grade: "G1",
  departure: "15:40",
  distance: "2500m",
  raceName: "2025 Arima Kinen",
  netkeibaUrl: null,
};

const defaultHorses = [
  { id: 1, name: "Oguri Cap", odds: 11.1 },
  { id: 2, name: "Kitasan Black", odds: 30.3 },
  { id: 3, name: "Special Sunday", odds: 2.0 },
  { id: 4, name: "King Kamehameha", odds: 1.8 },
  { id: 5, name: "Gentildonna", odds: 4.4 },
  { id: 6, name: "Orfevre", odds: 2.7 },
  { id: 7, name: "Tamamo Cross", odds: 15.8 },
  { id: 8, name: "Stay Gold", odds: 7.4 },
  { id: 9, name: "Prince Loupan", odds: 21.0 },
  { id: 10, name: "King Argentin", odds: 19.7 },
];

const defaultSimRace = {
  raceName: "Simulation Cup",
  venue: "Virtual Track",
  distance: "2000m",
  grade: "SIM",
  condition: "Good",
};

const defaultSimHorses = [
  { id: 1, name: "Tokai Teio", odds: 3.5 },
  { id: 2, name: "Mejiro McQueen", odds: 4.2 },
  { id: 3, name: "Rice Shower", odds: 8.8 },
  { id: 4, name: "Silence Suzuka", odds: 2.1 },
  { id: 5, name: "Gold Ship", odds: 12.5 },
  { id: 6, name: "Daiwa Scarlet", odds: 5.6 },
];

// ================= LOAD MAIN RACE DATA =================
let raceDetail = fs.existsSync(raceFile)
  ? JSON.parse(fs.readFileSync(raceFile))
  : { ...defaultRaceDetail };

if (!raceDetail.raceName) {
  raceDetail.raceName = defaultRaceDetail.raceName;
}

let users = fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile)) : {};

let horses = fs.existsSync(horsesFile)
  ? JSON.parse(fs.readFileSync(horsesFile))
  : [...defaultHorses];

// ================= LOAD SIM RACE DATA =================
let simRaceDetail = fs.existsSync(simRaceFile)
  ? JSON.parse(fs.readFileSync(simRaceFile))
  : { ...defaultSimRace };

let simHorses = fs.existsSync(simHorsesFile)
  ? JSON.parse(fs.readFileSync(simHorsesFile))
  : [...defaultSimHorses];

// ================= RUNTIME STATE =================
// Load bets from file for persistence
let bets = fs.existsSync(betsFile) ? JSON.parse(fs.readFileSync(betsFile)) : {};

// Joined users loaded from bets (anyone with a bet is joined)
const joinedUsers = new Set(Object.keys(bets));

let raceClosed = false;

function saveBets() {
  fs.writeFileSync(betsFile, JSON.stringify(bets, null, 2));
}

// ================= SIM RACE STATE =================
let simRaceActive = false;
let simBets = {};
let simMessage = null;

// ================= GUILD SETTINGS =================
let guilds = fs.existsSync(guildsFile) ? JSON.parse(fs.readFileSync(guildsFile)) : {};

function getGuildSettings(guildId) {
  if (!guilds[guildId]) {
    guilds[guildId] = {
      admins: [],
      allowedChannels: [],
      setupComplete: false,
      gamblerRoleId: null,       // Role to mention for race announcements
      announcementChannelId: null, // Channel for race announcements
    };
    saveGuildSettings();
  }
  return guilds[guildId];
}

function saveGuildSettings() {
  fs.writeFileSync(guildsFile, JSON.stringify(guilds, null, 2));
}

function isGuildAdmin(guildId, userId) {
  // Super admin always has access
  if (userId === process.env.ADMIN_ID) return true;
  const settings = getGuildSettings(guildId);
  return settings.admins.includes(userId);
}

function addGuildAdmin(guildId, userId) {
  const settings = getGuildSettings(guildId);
  if (!settings.admins.includes(userId)) {
    settings.admins.push(userId);
    saveGuildSettings();
  }
}

function removeGuildAdmin(guildId, userId) {
  const settings = getGuildSettings(guildId);
  settings.admins = settings.admins.filter(id => id !== userId);
  saveGuildSettings();
}

function isAllowedChannel(guildId, channelId) {
  const settings = getGuildSettings(guildId);
  // If no channels set, allow all
  if (settings.allowedChannels.length === 0) return true;
  return settings.allowedChannels.includes(channelId);
}

function addAllowedChannel(guildId, channelId) {
  const settings = getGuildSettings(guildId);
  if (!settings.allowedChannels.includes(channelId)) {
    settings.allowedChannels.push(channelId);
    saveGuildSettings();
  }
}

function removeAllowedChannel(guildId, channelId) {
  const settings = getGuildSettings(guildId);
  settings.allowedChannels = settings.allowedChannels.filter(id => id !== channelId);
  saveGuildSettings();
}

function setSetupComplete(guildId, complete = true) {
  const settings = getGuildSettings(guildId);
  settings.setupComplete = complete;
  saveGuildSettings();
}

// ================= SAVE FUNCTIONS =================
function saveUsers() {
  fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
}

function saveRaceDetail() {
  fs.writeFileSync(raceFile, JSON.stringify(raceDetail, null, 2));
}

function saveHorses() {
  fs.writeFileSync(horsesFile, JSON.stringify(horses, null, 2));
}

function saveSimRaceDetail() {
  fs.writeFileSync(simRaceFile, JSON.stringify(simRaceDetail, null, 2));
}

function saveSimHorses() {
  fs.writeFileSync(simHorsesFile, JSON.stringify(simHorses, null, 2));
}

function reloadHorses() {
  if (fs.existsSync(horsesFile)) {
    horses = JSON.parse(fs.readFileSync(horsesFile));
  }
}

function reloadSimHorses() {
  if (fs.existsSync(simHorsesFile)) {
    simHorses = JSON.parse(fs.readFileSync(simHorsesFile));
  }
}

// ================= USER FUNCTIONS =================
function getUser(id) {
  if (!users[id]) {
    users[id] = { balance: START_BALANCE };
    saveUsers();
  }
  return users[id];
}

function dailyRemaining(user) {
  const diff = 24 * 60 * 60 * 1000 - (Date.now() - user.lastDaily);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

// ================= RACE FUNCTIONS =================
function parseRaceDateTime() {
  // Parse date in DD/MM/YYYY format or other common formats
  const dateStr = raceDetail.date;
  const [h, m] = raceDetail.departure.split(":").map(Number);
  
  let raceDate;
  
  // Try DD/MM/YYYY format first
  if (dateStr && dateStr.includes("/")) {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      // DD/MM/YYYY
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
      const year = parseInt(parts[2]);
      raceDate = new Date(year, month, day, h, m, 0, 0);
    }
  }
  
  // Try parsing as natural language date (e.g., "Sunday, December 28, 2025")
  if (!raceDate || isNaN(raceDate.getTime())) {
    raceDate = new Date(dateStr);
  }
  
  // If still invalid, fall back to today
  if (!raceDate || isNaN(raceDate.getTime())) {
    raceDate = new Date();
  }
  
  raceDate.setHours(h, m, 0, 0);
  return raceDate;
}

function isAfterDeparture() {
  const now = new Date();
  const dep = parseRaceDateTime();
  return now >= dep;
}

function countdown() {
  const now = new Date();
  const dep = parseRaceDateTime();
  
  if (now >= dep) return "⛔ Betting Closed";
  
  const diff = dep - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `⏳ ${days}d ${hours}h ${mins}m`;
  }
  return `⏳ ${hours}h ${mins}m`;
}

function simulateWinner(horseList) {
  const weighted = horseList.map((h) => ({
    horse: h,
    weight: 1 / h.odds,
  }));

  const total = weighted.reduce((s, h) => s + h.weight, 0);
  let roll = Math.random() * total;

  for (const h of weighted) {
    roll -= h.weight;
    if (roll <= 0) return h.horse;
  }

  return weighted[weighted.length - 1].horse;
}

// ================= MAIN RACE HORSE MANAGEMENT =================
function addOrUpdateHorse(id, name, odds) {
  const existingIndex = horses.findIndex((h) => h.id === id);
  if (existingIndex >= 0) {
    horses[existingIndex] = { id, name, odds };
  } else {
    horses.push({ id, name, odds });
  }
  horses.sort((a, b) => a.id - b.id);
  saveHorses();
}

function removeHorse(id) {
  const index = horses.findIndex((h) => h.id === id);
  if (index >= 0) {
    horses.splice(index, 1);
    saveHorses();
    return true;
  }
  return false;
}

function setRaceName(name) {
  raceDetail.raceName = name;
  saveRaceDetail();
}

// ================= SIM RACE HORSE MANAGEMENT =================
function addOrUpdateSimHorse(id, name, odds) {
  const existingIndex = simHorses.findIndex((h) => h.id === id);
  if (existingIndex >= 0) {
    simHorses[existingIndex] = { id, name, odds };
  } else {
    simHorses.push({ id, name, odds });
  }
  simHorses.sort((a, b) => a.id - b.id);
  saveSimHorses();
}

function removeSimHorse(id) {
  const index = simHorses.findIndex((h) => h.id === id);
  if (index >= 0) {
    simHorses.splice(index, 1);
    saveSimHorses();
    return true;
  }
  return false;
}

function setSimRaceName(name) {
  simRaceDetail.raceName = name;
  saveSimRaceDetail();
}

function setSimRaceDetail(field, value) {
  simRaceDetail[field] = value;
  saveSimRaceDetail();
}

// ================= EXPORTS =================
module.exports = {
  // Main Race Data
  get horses() { return horses; },
  get raceDetail() { return raceDetail; },
  get users() { return users; },
  joinedUsers,
  bets,

  // Sim Race Data
  get simHorses() { return simHorses; },
  get simRaceDetail() { return simRaceDetail; },

  // State getters/setters
  get raceClosed() { return raceClosed; },
  set raceClosed(val) { raceClosed = val; },
  get simRaceActive() { return simRaceActive; },
  set simRaceActive(val) { simRaceActive = val; },
  get simBets() { return simBets; },
  set simBets(val) { simBets = val; },
  get simMessage() { return simMessage; },
  set simMessage(val) { simMessage = val; },

  // Main Race Functions
  saveUsers,
  saveRaceDetail,
  saveHorses,
  reloadHorses,
  getUser,
  dailyRemaining,
  isAfterDeparture,
  countdown,
  simulateWinner,
  addOrUpdateHorse,
  removeHorse,
  setRaceName,
  saveBets,

  // Sim Race Functions
  saveSimRaceDetail,
  saveSimHorses,
  reloadSimHorses,
  addOrUpdateSimHorse,
  removeSimHorse,
  setSimRaceName,
  setSimRaceDetail,

  // Guild Settings Functions
  get guilds() { return guilds; },
  getGuildSettings,
  saveGuildSettings,
  isGuildAdmin,
  addGuildAdmin,
  removeGuildAdmin,
  isAllowedChannel,
  addAllowedChannel,
  removeAllowedChannel,
  setSetupComplete,
  
  // Announcer Settings
  setGamblerRole(guildId, roleId) {
    const settings = getGuildSettings(guildId);
    settings.gamblerRoleId = roleId;
    saveGuildSettings();
  },
  setAnnouncementChannel(guildId, channelId) {
    const settings = getGuildSettings(guildId);
    settings.announcementChannelId = channelId;
    saveGuildSettings();
  },
};

