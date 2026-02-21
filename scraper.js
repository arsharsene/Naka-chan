const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://en.netkeiba.com";

/**
 * Extract race_id from netkeiba URL
 */
function extractRaceId(url) {
  const match = url.match(/race_id=(\d+)/);
  return match ? match[1] : null;
}

/**
 * Scrape race details from netkeiba shutuba (field) page
 */
async function scrapeRace(raceUrl) {
  try {
    const raceId = extractRaceId(raceUrl);
    if (!raceId) throw new Error("Invalid netkeiba URL");

    const url = `${BASE_URL}/race/shutuba.html?race_id=${raceId}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 30000,
    });

    const $ = cheerio.load(data);

    // Parse race info from title and page
    // Title format: "NIKKEI SHINSHUN HAI (G2) Field | 18 JAN 2026 R11 Kyoto Racing Information (JRA) - netkeiba"
    const title = $("title").text();
    console.log("Page title:", title);
    
    // Extract race name from title (before "|" or "(G#)")
    let raceName = "Netkeiba Race";
    let grade = "OP";
    
    // Try to get from RaceName class
    const raceNameEl = $(".RaceName").text().trim();
    if (raceNameEl) {
      raceName = raceNameEl.replace(/\(G\d\)/gi, "").trim();
    } else {
      // Parse from title - get text before "Field" or "|"
      const titleMatch = title.match(/^([^|]+)/);
      if (titleMatch) {
        raceName = titleMatch[1].replace(/\(G\d\)/gi, "").replace("Field", "").trim();
      }
    }
    
    // Extract grade
    if (title.includes("(G1)") || title.includes(" G1 ")) grade = "G1";
    else if (title.includes("(G2)") || title.includes(" G2 ")) grade = "G2";
    else if (title.includes("(G3)") || title.includes(" G3 ")) grade = "G3";

    // Extract date from title (format: "18 JAN 2026" or "17 JAN 2026")
    // Pattern: DD MMM YYYY
    let date = "01/01/2026";
    const months = {
      "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06",
      "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12"
    };
    
    const dateMatch = title.match(/(\d{1,2})\s*(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\s*(\d{4})/i);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const month = months[dateMatch[2].toUpperCase()];
      const year = dateMatch[3];
      date = `${day}/${month}/${year}`;
    }

    // Extract venue from title - look for venue name after date
    // Title format: "... | 18 JAN 2026 R11 Kyoto Racing Information..."
    const venues = ["Nakayama", "Tokyo", "Kyoto", "Hanshin", "Chukyo", "Sapporo", "Hakodate", "Fukushima", "Niigata", "Kokura"];
    let venue = "JRA";
    
    // Look for venue in the section after the date in title
    const afterDate = title.split(/\d{4}/)[1] || title;
    for (const v of venues) {
      if (afterDate.toLowerCase().includes(v.toLowerCase())) {
        venue = v;
        break;
      }
    }
    
    // Fallback: check entire title
    if (venue === "JRA") {
      for (const v of venues) {
        if (title.toLowerCase().includes(v.toLowerCase())) {
          venue = v;
          break;
        }
      }
    }

    // Extract race number from title (e.g., "R11")
    const raceNoMatch = title.match(/R(\d+)/);
    const raceNo = raceNoMatch ? `R${raceNoMatch[1]}` : "R11";
    const raceNum = raceNoMatch ? raceNoMatch[1] : "11";

    // Extract departure time (JST) using cheerio selectors
    let departureJST = null;
    
    // Method 1: Look for the specific race link in navigation (contains R## and time)
    // These appear as list items with race number and time
    $('a').each((i, el) => {
      if (departureJST) return;
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();
      
      // Match links to this specific race
      if (href.includes(`race_id=${raceId}`) || href.includes(`race_id=${raceId}`)) {
        // Look for time pattern in the link text or nearby elements
        const timeMatch = text.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const h = parseInt(timeMatch[1]);
          if (h >= 9 && h <= 17) {
            departureJST = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
            console.log(`Found time in link: ${departureJST}`);
          }
        }
      }
    });
    
    // Method 2: Look for R11 links with time in navigation
    if (!departureJST) {
      const fullText = $.text();
      // Pattern: R11 followed by time on same or next line
      const r11Pattern = new RegExp(`R${raceNum}[^0-9]*(\\d{1,2}):(\\d{2})`);
      const match = fullText.match(r11Pattern);
      if (match) {
        departureJST = `${match[1].padStart(2, '0')}:${match[2]}`;
        console.log(`Found R${raceNum} time in text: ${departureJST}`);
      }
    }
    
    // Method 3: Find time near the race header info
    if (!departureJST) {
      // Look for text containing the race name and find time after it  
      const fullText = $.text();
      const raceNameIndex = fullText.toUpperCase().indexOf(raceName.toUpperCase());
      if (raceNameIndex > -1) {
        const afterRaceName = fullText.substring(raceNameIndex, raceNameIndex + 100);
        const timeMatch = afterRaceName.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          departureJST = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
          console.log(`Found time after race name: ${departureJST}`);
        }
      }
    }
    
    // Method 4: Search for any time between 09:00 and 17:00 near race info
    if (!departureJST) {
      const fullText = $.text();
      const allTimes = fullText.match(/\d{1,2}:\d{2}/g) || [];
      for (const t of allTimes) {
        const [h, m] = t.split(':').map(Number);
        // R11 races are typically afternoon, 14:00-16:00
        if (h >= 14 && h <= 16) {
          departureJST = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
          console.log(`Found afternoon race time: ${departureJST}`);
          break;
        }
      }
    }
    
    if (!departureJST) {
      console.warn("Could not extract departure time from page, using default");
      departureJST = "15:30"; // Default for R11 grade races
    }
    
    console.log("Final JST time:", departureJST);
    
    // Convert JST (GMT+9) to WIB/Jakarta (GMT+7) = subtract 2 hours
    const [hours, minutes] = departureJST.split(":").map(Number);
    let jakartaHours = hours - 2;
    if (jakartaHours < 0) jakartaHours += 24;
    const departure = `${String(jakartaHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // Extract distance
    let distance = "2000m";
    const distanceMatch = data.match(/T(\d{3,4})m/);
    if (distanceMatch) {
      distance = distanceMatch[1] + "m";
    } else {
      const distMatch2 = data.match(/(\d{3,4})m\s*\(/);
      if (distMatch2) distance = distMatch2[1] + "m";
    }

    return {
      date,
      venue,
      raceNo,
      grade,
      departure,
      distance,
      raceName,
      netkeibaUrl: url,
      raceId,
    };
  } catch (error) {
    console.error("Error scraping race:", error.message);
    throw error;
  }
}

/**
 * Scrape horse list from netkeiba using Playwright to handle dynamic JS (Odds & Fav)
 */
async function scrapeHorses(raceUrl) {
  try {
    const raceId = extractRaceId(raceUrl);
    if (!raceId) throw new Error("Invalid netkeiba URL");

    const playwright = require("playwright");
    console.log("Launching Playwright browser...");
    const browser = await playwright.chromium.launch({ headless: true });
    
    // First, try visiting the newspaper page to get a clean horse list
    const newspaperUrl = `${BASE_URL}/race/newspaper.html?race_id=${raceId}`;
    let context = await browser.newContext({
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    });
    
    let page = await context.newPage();
    console.log("Navigating to newspaper page:", newspaperUrl);
    await page.goto(newspaperUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    
    // Evaluate in browser context to extract clean horse names
    const horses = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      const horseLinks = document.querySelectorAll('a[href*="/db/horse/"]');
      
      horseLinks.forEach(link => {
        const horseName = link.textContent.trim();
        if (!horseName || horseName.length < 2 || horseName.includes("Movie")) return;
        if (horseName.match(/^\d+$/) || horseName.match(/^[A-Z]\d+$/)) return;
        if (horseName.match(/Stakes|Cup|Sho|Kinen|Hai|Tokubetsu|Handicap|Trophy|Alw/i)) return;
        
        if (seen.has(horseName)) return;
        seen.add(horseName);
        
        results.push({
          id: results.length + 1,
          name: horseName,
          odds: 10.0,
          fav: results.length + 1,
        });
      });
      return results;
    });

    console.log(`Found ${horses.length} horses from newspaper page.`);
    await page.close();

    // Now visit shutuba to get dynamic odds and favs
    const shutubaUrl = `${BASE_URL}/race/shutuba.html?race_id=${raceId}`;
    page = await context.newPage();
    console.log("Navigating to shutuba page for odds and fav:", shutubaUrl);
    // Wait until networkidle to ensure odds are loaded completely!
    await page.goto(shutubaUrl, { waitUntil: "networkidle", timeout: 60000 });
    
    const shutubaData = await page.evaluate((knownHorses) => {
      const updates = {};
      const rows = document.querySelectorAll("tr");
      
      rows.forEach(row => {
        const popularCell = row.querySelector("td.Popular");
        if (!popularCell) return;
        
        let horseName = null;
        const links = row.querySelectorAll("a");
        links.forEach(a => {
          const text = a.textContent.trim();
          if (knownHorses.find(h => h.name === text)) {
            horseName = text;
          }
        });
        
        if (!horseName) return;
        
        // Extract odds
        let odds = 10.0;
        const oddsMatch = popularCell.textContent.trim().match(/(\d+\.?\d*)/);
        if (oddsMatch) {
          const val = parseFloat(oddsMatch[1]);
          if (val > 0 && val < 1000) odds = val;
        }
        
        // Extract fav
        let fav = 0;
        const favCell = row.querySelector("td.Fav");
        if (favCell) {
          const favMatch = favCell.textContent.trim().match(/(\d+)/);
          if (favMatch) {
            const val = parseInt(favMatch[1]);
            if (val > 0 && val <= 20) fav = val;
          }
        }
        
        updates[horseName] = { odds, fav };
      });
      return updates;
    }, horses);

    // Apply updates
    let matchedCount = 0;
    horses.forEach(h => {
      const update = shutubaData[h.name];
      if (update) {
        h.odds = update.odds;
        if (update.fav) h.fav = update.fav;
        else h.fav = h.id; // fallback if fav not found dynamically
        matchedCount++;
      }
    });

    console.log(`Matched ${matchedCount} horses with shutuba odds/fav via Playwright`);
    await browser.close();

    console.log(`Final ${horses.length} horses:`, horses.map(h => `${h.name}: ${h.odds}x (fav ${h.fav})`).join(", "));

    return horses;
  } catch (error) {
    console.error("Error scraping horses with Playwright:", error.message);
    throw error;
  }
}


/**
 * Scrape race result to get winner
 */
async function scrapeResult(raceUrl) {
  try {
    const raceId = extractRaceId(raceUrl);
    if (!raceId) throw new Error("Invalid netkeiba URL");

    const url = `${BASE_URL}/race/race_result.html?race_id=${raceId}`;
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 30000,
    });

    const $ = cheerio.load(data);

    // Check if results are available by looking for result table or winner info
    const hasResult = data.includes("Result_Table") || data.includes("ResultTable") || 
                      data.includes("1st") || data.includes("Winner");
    
    if (!hasResult) {
      return { finished: false, message: "Race not finished yet" };
    }

    // Try to find the winner (1st place horse)
    let winner = null;
    
    // Look for horse links in the result section
    $('a[href*="/db/horse/"]').each((index, element) => {
      if (winner) return; // Already found
      
      const $link = $(element);
      const horseName = $link.text().trim();
      
      if (!horseName || horseName.length < 2) return;
      if (horseName.match(/Movie|Stakes|Cup|Sho|Kinen/i)) return;
      
      // First valid horse in result page is usually the winner
      winner = {
        id: 1,
        name: horseName,
        odds: 0,
      };
    });

    if (winner) {
      return {
        finished: true,
        winnerId: winner.id,
        winnerName: winner.name,
        winOdds: winner.odds,
      };
    }

    return { finished: false, message: "Could not determine winner" };
  } catch (error) {
    console.error("Error scraping result:", error.message);
    throw error;
  }
}

module.exports = {
  extractRaceId,
  scrapeRace,
  scrapeHorses,
  scrapeResult,
};
