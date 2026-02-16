<div align="center">

# 🐎 Naka-chan

### _Uma Musume-Inspired Discord Horse Racing & Betting Bot_

[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<img src="https://media.tenor.com/q0B8U52qNVt/umamusume-umasugi-gourmet-parade.gif" alt="Uma Musume Animation" width="400"/>

**Experience the thrill of horse racing right in your Discord server!**  
_Bet your 🥕 Carrats, watch exciting races, and climb the leaderboard!_

[🎮 Add to Server](#installation) • [📖 Commands](#commands) • [⚙️ Setup](#setup) • [🤝 Contributing](#contributing)

</div>

---

## 👋 Hey There, Fellow Gambler!

So you've stumbled upon **Naka-chan**, huh? Welcome to the wild world of virtual horse racing! 🎉

Whether you're here because you love Uma Musume, you have a gambling addiction (we don't judge), or you just want to make your Discord server more chaotic - **you're in the right place!**

> _"But wait, is this actually fun?"_  
> **Yes.** Yes it is. Trust us. Your server members will be betting their 🥕 Carrats like degenerates in no time.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎰 **Betting System**

- Place bets on your favorite horses
- Dynamic odds system
- All-in mode for the brave (or stupid)!
- Simulation races with Uma Musume characters

</td>
<td width="50%">

### 💰 **Economy**

- Daily 🥕 Carrats rewards (free money!)
- Personal balance tracking
- Server-wide leaderboards
- Bet history (for when you need to cry)

</td>
</tr>
<tr>
<td width="50%">

### 🤖 **Smart Response System**

- Human-like conversations when mentioning the bot
- Context-aware replies based on keywords
- Varied greetings and reactions
- Special personality responses
- No external AI APIs needed!

</td>
<td width="50%">

### 🏇 **Race Management**

- **Import REAL races from netkeiba.com**
- Add/remove horses with custom odds
- Real-time race simulations
- Beautiful animated race displays

</td>
<td width="50%">

### 🛡️ **Admin Controls**

- Interactive admin dashboard
- Per-server admin roles
- Channel restrictions
- Race announcer (30min reminder)
- **Edit horse odds via popup modal**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A Discord Bot Token ([Get one here](https://discord.com/developers/applications))
- A willingness to lose all your virtual carrots 🥕

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/naka-chan.git

# Navigate to project directory
cd naka-chan

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your bot token

# Deploy slash commands
npm run deploy

# Start the bot
npm start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
BOT_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_bot_client_id_here
ADMIN_ID=your_discord_user_id_here
GUILD_ID=your_server_id_here
```

### Dependencies

Install all dependencies with one command:

```bash
npm install discord.js dotenv axios cheerio canvas
```

| Package    | Description                       |
| ---------- | --------------------------------- |
| discord.js | Discord API library               |
| dotenv     | Environment variables loader      |
| axios      | HTTP client for netkeiba scraping |
| cheerio    | HTML parsing                      |
| canvas     | Race animation images             |

> 📄 See `dependencies.txt` for detailed install commands and system requirements.

---

## 📋 Commands

### 👤 User Commands

| Command                    | Description                             |
| -------------------------- | --------------------------------------- |
| `/help`                    | Your beautiful user dashboard           |
| `/joinrace`                | View race details and horse lineup      |
| `/bet <horse> <amount>`    | Place a bet (and pray)                  |
| `/simbet <horse> <amount>` | Bet on simulation races                 |
| `/mybets`                  | See what you've gotten yourself into    |
| `/balance`                 | Check your 🥕 Carrats balance           |
| `/daily`                   | Claim your daily 100 🥕 Carrats         |
| `/leaderboard`             | See who's the biggest winner (or loser) |
| `/racedetails`             | Get current race information            |

### 🔧 Admin Commands

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `/admin`         | Interactive admin dashboard                    |
| `/setup`         | Configure bot settings for your server         |
| `/importrace`    | Import race & horses from netkeiba.com         |
| `/sethorse`      | Add a new horse to the race                    |
| `/removehorse`   | Remove a horse (RIP)                           |
| `/listhorses`    | View all registered horses                     |
| `/setracename`   | Set the race name                              |
| `/setracedetail` | Configure race details                         |
| `/setwinner`     | Declare the winning horse & distribute payouts |
| `/simrace`       | Run an animated simulation race                |
| `/say`           | Make the bot send a message to any channel     |
| `/clean`         | Delete messages in channel (1-100)             |

### 🌐 How to Import Races from Netkeiba

Want to run **real JRA races** in your server? Here's how:

**Step 1:** Go to [en.netkeiba.com](https://en.netkeiba.com/)

**Step 2:** Find a race and copy the URL, for example:

```
https://en.netkeiba.com/race/shutuba.html?race_id=202608010711
```

**Step 3:** Use the import command:

```
/importrace url:https://en.netkeiba.com/race/shutuba.html?race_id=202608010711
```

**What gets imported:**

- 🏇 Race name, venue, date, time
- 🐎 All horses in the race
- ⏰ Departure time (auto-converted to WIB timezone)

> ⚠️ **Note:** Odds are loaded dynamically on netkeiba.com via JavaScript, so they may show as 10.0x by default. Use `/admin` → **Edit Horse** button to manually update odds!

---

## 🎮 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     🏁 RACE DAY FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1️⃣ Admin imports race      ───►   Set horses & odds      │
│                                                             │
│   2️⃣ Users place bets        ───►   /bet or /joinrace      │
│                                                             │
│   3️⃣ Race simulation runs    ───►   Animated race display  │
│                                                             │
│   4️⃣ Winner declared         ───►   Payouts distributed    │
│                                                             │
│   5️⃣ Leaderboard updates     ───►   Glory (or shame) 🏆    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 Smart Response System

Naka-chan doesn't just respond to commands - she can **chat with you** too! Using a contextual keyword detection system, she'll reply with human-like, varied responses when you mention her.

### How It Works

Instead of relying on external AI APIs, Naka-chan uses a smart pattern-matching system (`responses.js`) that:

1. **Detects context** from your message (keywords, emojis, patterns)
2. **Selects appropriate response category** (greetings, betting, love, laughter, etc.)
3. **Picks a random reply** from that category for variety
4. **Maintains personality** with cute, playful, and sometimes sassy responses

### Example Interactions

| What You Say                       | How Naka-chan Responds                              |
| ---------------------------------- | --------------------------------------------------- |
| `@Naka-chan`                       | _"haii~ (≧▽≦) ada apa nih?"_                        |
| `@Naka-chan mau bet nih`           | _"mau taruhan? semangat! ketik /joinrace ya~ 🐎✨"_ |
| `@Naka-chan sayang kamu`           | _"aww makasih~ kamu juga! (｡♥‿♥｡)"_                 |
| `@Naka-chan wkwkwk`                | _"WKWKWK bisa aja kamu~ 😂"_                        |
| `@Naka-chan gimana cara pakainya?` | _Shows full help embed with commands_               |

### Supported Contexts

- 💬 **Greetings** - Friendly hellos and introductions
- ❤️ **Love/Affection** - Sweet responses to compliments
- 😂 **Laughter** - Playful reactions to jokes
- 😢 **Sadness** - Comforting messages
- 😡 **Anger** - Calming/apologetic responses
- 🎰 **Betting** - Racing and gambling related replies
- 🙏 **Thanks** - Appreciative acknowledgments
- ❓ **Questions** - Helpful redirects to `/help`
- 🐎 **Horses** - Uma Musume enthusiasm!
- 🍔 **Food** - Carrot obsession 🥕
- 👋 **Goodbyes** - Friendly farewells

> 🎭 **Pro Tip:** Try mentioning Naka-chan with different keywords or emotions and see how she responds!

---

## 🏗️ Project Structure

```
naka-chan/
├── 📁 commands/
│   ├── 📁 admin/         # Admin-only commands
│   ├── 📁 buttons/       # Button interaction handlers
│   ├── 📁 user/          # User commands
│   └── 📄 shared.js      # Shared utilities & data
├── 📁 data/              # Persistent data storage (Uma Musume characters!)
├── 📄 index.js           # Main bot entry point
├── 📄 responses.js       # Smart response system for bot mentions
├── 📄 scraper.js         # Netkeiba.com race scraper
├── 📄 announcer.js       # Race announcement system
├── 📄 deploy-commands.js # Slash command deployment
└── 📄 package.json
```

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 💖 Acknowledgments

- Inspired by [Uma Musume Pretty Derby](https://umamusume.jp/) 🐴
- Race data from [netkeiba.com](https://en.netkeiba.com/)
- Built with [Discord.js](https://discord.js.org/)
- And all you beautiful degenerates who bet virtual carrots on virtual horses 💜

---

<div align="center">

### 🎰 Thanks for Reading!

If you actually read this whole README, you're a legend. Most people just scroll to the install commands. But not you. You're special. ⭐

**Now go lose some carrots!** 🥕

---

**Made with 💜 and lots of 🥕 Carrats**

_"Bet big, win bigger!"_ (or lose everything, no refunds)

</div>
