// Uma Musume Pretty Derby character database
// Used for random horse generation in simulation races

const umaMusumeCharacters = [
  // Main Characters
  { name: "Special Week", baseOdds: 2.5, tier: "S" },
  { name: "Silence Suzuka", baseOdds: 2.0, tier: "S" },
  { name: "Tokai Teio", baseOdds: 2.2, tier: "S" },
  { name: "Mejiro McQueen", baseOdds: 2.8, tier: "S" },
  { name: "Vodka", baseOdds: 3.0, tier: "S" },
  { name: "Gold Ship", baseOdds: 4.5, tier: "A" },
  { name: "Daiwa Scarlet", baseOdds: 3.2, tier: "A" },
  { name: "Winning Ticket", baseOdds: 5.0, tier: "A" },
  { name: "Sakura Bakushin O", baseOdds: 3.5, tier: "A" },
  { name: "Oguri Cap", baseOdds: 2.3, tier: "S" },
  
  // Popular Characters
  { name: "Rice Shower", baseOdds: 6.0, tier: "A" },
  { name: "Mihono Bourbon", baseOdds: 5.5, tier: "A" },
  { name: "Maruzensky", baseOdds: 3.8, tier: "A" },
  { name: "Tamamo Cross", baseOdds: 7.0, tier: "B" },
  { name: "Super Creek", baseOdds: 8.0, tier: "B" },
  { name: "Agnes Tachyon", baseOdds: 4.0, tier: "A" },
  { name: "Manhattan Cafe", baseOdds: 5.2, tier: "A" },
  { name: "Symboli Rudolf", baseOdds: 2.5, tier: "S" },
  { name: "Air Groove", baseOdds: 4.5, tier: "A" },
  { name: "Agnes Digital", baseOdds: 6.5, tier: "B" },
  
  // Classic Characters
  { name: "Grass Wonder", baseOdds: 4.2, tier: "A" },
  { name: "El Condor Pasa", baseOdds: 3.5, tier: "A" },
  { name: "T.M. Opera O", baseOdds: 3.0, tier: "S" },
  { name: "Narita Brian", baseOdds: 2.8, tier: "S" },
  { name: "Hishi Amazon", baseOdds: 5.8, tier: "B" },
  { name: "Mayano Top Gun", baseOdds: 5.0, tier: "A" },
  { name: "Biwa Hayahide", baseOdds: 4.0, tier: "A" },
  { name: "Narita Taishin", baseOdds: 6.2, tier: "B" },
  { name: "Seiun Sky", baseOdds: 5.5, tier: "A" },
  { name: "King Halo", baseOdds: 7.5, tier: "B" },
  
  // More Characters
  { name: "Haru Urara", baseOdds: 50.0, tier: "C" },
  { name: "Matikanefukukitaru", baseOdds: 8.5, tier: "B" },
  { name: "Nice Nature", baseOdds: 9.0, tier: "B" },
  { name: "Ikuno Dictus", baseOdds: 10.0, tier: "B" },
  { name: "Tama Mo Caro", baseOdds: 12.0, tier: "C" },
  { name: "Sweep Tosho", baseOdds: 8.0, tier: "B" },
  { name: "Curren Chan", baseOdds: 6.8, tier: "B" },
  { name: "Fine Motion", baseOdds: 4.2, tier: "A" },
  { name: "Admire Vega", baseOdds: 5.0, tier: "A" },
  { name: "Eishin Flash", baseOdds: 6.0, tier: "B" },
  
  // Recent Additions
  { name: "Kitasan Black", baseOdds: 2.0, tier: "S" },
  { name: "Satono Diamond", baseOdds: 3.5, tier: "A" },
  { name: "Duramente", baseOdds: 2.8, tier: "S" },
  { name: "Copano Rickey", baseOdds: 7.0, tier: "B" },
  { name: "Smart Falcon", baseOdds: 4.5, tier: "A" },
  { name: "Wonder Acute", baseOdds: 8.5, tier: "B" },
  { name: "Nakayama Festa", baseOdds: 6.5, tier: "B" },
  { name: "Zenno Rob Roy", baseOdds: 5.8, tier: "A" },
  { name: "Seeking the Pearl", baseOdds: 6.0, tier: "B" },
  { name: "Yukino Bijin", baseOdds: 9.5, tier: "B" },
];

/**
 * Get random horses for simulation race
 * @param {number} count - Number of horses (6-10)
 * @returns {Array} Array of horse objects with id, name, odds
 */
function getRandomHorses(count = 6) {
  const shuffled = [...umaMusumeCharacters].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));
  
  return selected.map((char, index) => {
    // Add some randomness to odds
    const variance = (Math.random() - 0.5) * 2; // -1 to +1
    let odds = char.baseOdds + variance;
    odds = Math.max(1.5, Math.round(odds * 10) / 10); // Minimum 1.5, round to 1 decimal
    
    return {
      id: index + 1,
      name: char.name,
      odds: odds,
    };
  });
}

/**
 * Get all Uma Musume characters
 */
function getAllCharacters() {
  return umaMusumeCharacters;
}

module.exports = {
  umaMusumeCharacters,
  getRandomHorses,
  getAllCharacters,
};
