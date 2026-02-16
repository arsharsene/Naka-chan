/**
 * Naka-chan Smart Response System
 * Human-like replies without external AI APIs
 */

// ============ RESPONSE POOLS ============

const greetings = [
  "haii~ (≧▽≦) ada apa nih?",
  "oh hai! kenapa tag aku? kangen ya~ (｡♥‿♥｡)",
  "yoo~ ada yang bisa aku bantu? ✨",
  "halo halo~ 🌸 mau ngapain nih?",
  "hai sayang~ ketik /help kalo bingung ya!",
  "waaah ada yang nyapa aku! hai hai~ (◕‿◕✿)",
  "konnichiwa~ ✨ mau main taruhan?",
  "hehe hai~ lagi gabut ya? sama dong (≧◡≦)",
  "yo! aku Naka-chan~ ada yang perlu dibantu? 🐎",
  "hai~ jangan lupa daily claim ya! ketik /daily 🥕",
];

const reactions = {
  love: [
    "aww makasih~ kamu juga! (｡♥‿♥｡)",
    "ih kamu bisa aja~ 🥰",
    "hehe aku juga sayang kamu~ ✨",
    "uwu makasih ya~ jadi malu (≧◡≦)",
    "kamu tuh ya~ bikin aku seneng aja 💕",
  ],
  laugh: [
    "WKWKWK bisa aja kamu~ 😂",
    "hahaha kocak banget deh 🤣",
    "ngakak aku tuh wkwk (≧▽≦)",
    "ya ampun wkwk 😆",
    "LOL gokil~ 😂✨",
  ],
  sad: [
    "jangan sedih dong~ aku temenin! (｡•́︿•̀｡)",
    "sabar ya.. semoga cepet baikkan~ 🌸",
    "aku disini kok kalo mau cerita~ ✨",
    "jangan down ya! main taruhan aja biar seru~ 🐎",
    "everything will be okay~ semangat! 💪✨",
  ],
  angry: [
    "sabar sabar~ jangan marah dong (；ω；)",
    "eh eh calm down~ tarik nafas dulu ✨",
    "maaf ya kalo aku salah~ (｡•́︿•̀｡)",
    "jangan gitu dong huhu.. aku kan cuma bot kecil~ 🥺",
    "oke oke aku diem deh~ peace ✌️",
  ],
  betting: [
    "mau taruhan? semangat! ketik /joinrace ya~ 🐎✨",
    "jangan lupa cek /racedetails dulu sebelum bet! 📊",
    "good luck buat taruhannya~ semoga menang banyak! 🏆",
    "hati-hati ya taruhannya~ jangan all in mulu wkwk 😂",
    "ayo ayo pasang taruhan! 🎰 ketik /help kalo bingung~",
    "feeling lucky hari ini? coba /joinrace deh! 🍀",
    "kuda favoritmu yang mana nih? cek /racedetails! 🐴",
  ],
  thanks: [
    "sama-sama~ (≧▽≦) ✨",
    "no problem! seneng bisa bantu~ 🌸",
    "hehe iya dong~ anything for you! 💕",
    "santai aja~ aku seneng kok! (◕‿◕✿)",
    "you're welcome~ ✨🐎",
  ],
  question: [
    "hmm aku kurang ngerti sih~ coba ketik /help ya! 📖",
    "wah pertanyaan bagus~ tapi aku cuma ngerti soal taruhan kuda nih wkwk 🐎",
    "aku agak bingung juga nih~ /help mungkin bisa bantu! ✨",
    "hmm gatau juga ya~ maaf ya aku bukan google wkwk 😅",
    "coba cek /help deh~ siapa tau ada jawabannya disitu! 📖✨",
  ],
  horse: [
    "Uma Musume is the best anime ever!! (≧▽≦) 🐎✨",
    "kuda kuda kuda~ aku suka banget kuda! 🐴💕",
    "special week best girl!! fight me wkwk 🏇",
    "kamu suka kuda juga? kita samaan dong~ (◕‿◕✿) 🐎",
    "horse racing itu seru banget tau ga! ayo bet! 🏆",
  ],
  food: [
    "aku sukanya carrot~ eh maksudnya 🥕 wkwk",
    "makan apa? aku mau dong~ (≧◡≦) 🍽️",
    "jangan lupa makan ya! biar kuat taruhan~ 💪✨",
    "aku kalo makan carrot aja wkwk 🥕🐎",
  ],
  bye: [
    "bye bye~ sampai ketemu lagi! (◕‿◕✿) ✨",
    "dadah~ jangan lupa /daily ya besok! 🥕",
    "bye~ semoga harimu menyenangkan! 🌸",
    "see you~ jangan lupa main lagi ya! 🐎✨",
    "babai~ take care! (≧▽≦) 💕",
  ],
  rama: [
    "ih rama lagi rama lagi... capek gue sama lu bangsat 💀",
    "RAMA KONTOL!! udah gue bilang jangan gitu terus!! 🤬",
    "rama lu tuh ya.. otak dipake napa sekali-kali tolol 😤",
    "anjing rama!! gue gampar lu ntar baru tau rasa 👊💢",
    "RAMA BANGSAT lu kapan sih bener?! gue udah muak!! 🔥😡",
    "dih rama.. lu emang bego dari lahir ya? gak ada obatnya 💀",
    "rama goblok!! tiap hari bikin pusing mulu kepala gue!! 🤬💢",
    "ya allah rama.. lu tuh sampah banget sumpah 🗑️😤",
    "RAMA!! gue sumpahin lu kalah taruhan terus seumur hidup!! 🐎💀",
    "rama anjir lu tuh kayak kuda yang gapernah menang.. useless 🐴😡",
    "eh rama bego!! sini gue ajarin cara jadi manusia normal!! 💢",
    "rama kontol.. mendingan lu diem aja deh daripada bikin malu 🤡",
    "RAMA TOLOL!! lu pikir lu siapa hah?! 😤🔥",
    "astaga rama.. tiap hari makin bego aja lu.. udah hopeless 💀😭",
  ],
};

const fallback = [
  "hmm? ada apa nih~ (≧◡≦)",
  "aku denger kok~ tapi gatau mau jawab apa wkwk 😅",
  "hehe iya iya~ ✨",
  "wah oke oke~ 🌸",
  "aku ngerti kok... mungkin wkwk (≧▽≦)",
  "hmm menarik~ tell me more! ✨",
  "oke noted ya~ 📝",
  "wah gitu ya~ aku kira apaan wkwk 😆",
  "iya iya bener tuh~ ✨🐎",
  "kamu lucu deh wkwk (◕‿◕✿)",
  "ooh gitu~ ketik /help kalo butuh bantuan ya!",
  "hehe~ 😊✨",
  "mau taruhan ga? daripada ngobrol mulu wkwk 🐎",
  "aku setuju! ... mungkin wkwk 😂",
  "santuy aja~ enjoy the ride! 🏇✨",
];

// ============ KEYWORD DETECTION ============

const patterns = {
  rama: /rama/i,
  love: /sayang|love|suka|cinta|luv|❤|💕|🥰|😘|cute|cantik|ganteng|keren|imut/i,
  laugh: /wkwk|haha|lol|lmao|😂|🤣|ngakak|gokil|kocak|lucu|anjir|gila|xd/i,
  sad: /sedih|sad|😢|😭|nangis|galau|down|kesel|capek|lelah|bosen|mager/i,
  angry: /marah|angry|😡|🤬|bego|bodoh|goblok|tolol|anjing|bangsat|brengsek|kesel/i,
  betting: /bet|taruhan|judi|race|odds|menang|kalah|jackpot|gamble|taruh/i,
  thanks: /makasih|thanks|thank|trims|thx|arigatou|ty|terima kasih|tq/i,
  question: /\?|gimana|bagaimana|apa itu|kenapa|mengapa|siapa|dimana|kapan|how|what|why|who|where|when/i,
  horse: /kuda|horse|uma|musume|special week|tokai teio|rice shower|mejiro/i,
  food: /makan|lapar|hungry|food|nasi|ayam|carrot|wortel|🥕|🍔|🍕/i,
  bye: /bye|dadah|sampai jumpa|see you|babai|selamat tinggal|good night|gn|tidur|bobo/i,
};

// ============ MAIN FUNCTION ============

/**
 * Get a human-like response based on the user's message
 * @param {string} message - The user's message (cleaned)
 * @returns {string} A response string
 */
function getResponse(message) {
  if (!message || message.trim().length === 0) {
    return pick(greetings);
  }

  const text = message.toLowerCase();

  // Check each pattern category
  for (const [category, regex] of Object.entries(patterns)) {
    if (regex.test(text)) {
      return pick(reactions[category]);
    }
  }

  // Fallback — random fun response
  return pick(fallback);
}

/**
 * Pick a random item from an array
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = { getResponse };
