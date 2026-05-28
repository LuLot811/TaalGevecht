/**
 * Vragenbank: Nederlands → Engels leren
 * minLevel: vanaf welk spelerslevel deze vraag kan komen
 * type: 'mc' (meerkeuze) | 'fill' (invuloefening)
 */

const QUESTION_POOL = {
  // Level 1-2: heel makkelijk — Nederlands woord → kies Engels
  mc_easy: [
    { dutch: "hond", answer: "dog", wrong: ["cat", "bird", "fish"] },
    { dutch: "kat", answer: "cat", wrong: ["dog", "cow", "pig"] },
    { dutch: "vogel", answer: "bird", wrong: ["fish", "dog", "bee"] },
    { dutch: "vis", answer: "fish", wrong: ["bird", "cat", "frog"] },
    { dutch: "bal", answer: "ball", wrong: ["box", "cup", "hat"] },
    { dutch: "boom", answer: "tree", wrong: ["house", "car", "sun"] },
    { dutch: "zon", answer: "sun", wrong: ["moon", "star", "rain"] },
    { dutch: "maan", answer: "moon", wrong: ["sun", "star", "cloud"] },
    { dutch: "huis", answer: "house", wrong: ["school", "car", "bed"] },
    { dutch: "bed", answer: "bed", wrong: ["chair", "table", "door"] },
    { dutch: "rood", answer: "red", wrong: ["blue", "green", "yellow"] },
    { dutch: "blauw", answer: "blue", wrong: ["red", "pink", "black"] },
    { dutch: "groen", answer: "green", wrong: ["blue", "brown", "white"] },
    { dutch: "geel", answer: "yellow", wrong: ["orange", "purple", "grey"] },
    { dutch: "een", answer: "one", wrong: ["two", "three", "four"] },
    { dutch: "twee", answer: "two", wrong: ["one", "five", "ten"] },
    { dutch: "drie", answer: "three", wrong: ["two", "six", "nine"] },
    { dutch: "ja", answer: "yes", wrong: ["no", "ok", "hi"] },
    { dutch: "nee", answer: "no", wrong: ["yes", "go", "stop"] },
    { dutch: "hallo", answer: "hello", wrong: ["bye", "thanks", "please"] },
    { dutch: "koe", answer: "cow", wrong: ["pig", "horse", "sheep"] },
    { dutch: "varken", answer: "pig", wrong: ["cow", "dog", "duck"] },
    { dutch: "paard", answer: "horse", wrong: ["cow", "donkey", "goat"] },
    { dutch: "eend", answer: "duck", wrong: ["chicken", "goose", "bird"] },
    { dutch: "kip", answer: "chicken", wrong: ["duck", "egg", "bird"] },
    { dutch: "muis", answer: "mouse", wrong: ["rat", "cat", "hamster"] },
    { dutch: "konijn", answer: "rabbit", wrong: ["hare", "cat", "dog"] },
    { dutch: "beer", answer: "bear", wrong: ["lion", "wolf", "teddy"] },
    { dutch: "leeuw", answer: "lion", wrong: ["tiger", "bear", "cat"] },
    { dutch: "appel", answer: "apple", wrong: ["pear", "banana", "orange"] },
    { dutch: "banaan", answer: "banana", wrong: ["apple", "pear", "grape"] },
    { dutch: "peer", answer: "pear", wrong: ["apple", "peach", "plum"] },
    { dutch: "brood", answer: "bread", wrong: ["cake", "rice", "butter"] },
    { dutch: "kaas", answer: "cheese", wrong: ["milk", "butter", "egg"] },
    { dutch: "ei", answer: "egg", wrong: ["milk", "bread", "cheese"] },
    { dutch: "melk", answer: "milk", wrong: ["water", "juice", "tea"] },
    { dutch: "water", answer: "water", wrong: ["milk", "juice", "soup"] },
    { dutch: "sap", answer: "juice", wrong: ["milk", "water", "soda"] },
    { dutch: "stoel", answer: "chair", wrong: ["table", "bed", "sofa"] },
    { dutch: "tafel", answer: "table", wrong: ["chair", "desk", "bed"] },
    { dutch: "deur", answer: "door", wrong: ["window", "wall", "floor"] },
    { dutch: "raam", answer: "window", wrong: ["door", "wall", "roof"] },
    { dutch: "boek", answer: "book", wrong: ["pen", "paper", "bag"] },
    { dutch: "pen", answer: "pen", wrong: ["pencil", "book", "eraser"] },
    { dutch: "potlood", answer: "pencil", wrong: ["pen", "ruler", "book"] },
    { dutch: "tas", answer: "bag", wrong: ["box", "hat", "coat"] },
    { dutch: "hoed", answer: "hat", wrong: ["cap", "coat", "shoe"] },
    { dutch: "schoen", answer: "shoe", wrong: ["sock", "hat", "boot"] },
    { dutch: "sok", answer: "sock", wrong: ["shoe", "glove", "hat"] },
    { dutch: "jas", answer: "coat", wrong: ["shirt", "pants", "hat"] },
    { dutch: "broek", answer: "pants", wrong: ["shirt", "skirt", "coat"] },
    { dutch: "shirt", answer: "shirt", wrong: ["pants", "coat", "dress"] },
    { dutch: "jurk", answer: "dress", wrong: ["skirt", "shirt", "coat"] },
    { dutch: "vinger", answer: "finger", wrong: ["toe", "hand", "nose"] },
    { dutch: "hand", answer: "hand", wrong: ["foot", "arm", "leg"] },
    { dutch: "voet", answer: "foot", wrong: ["hand", "leg", "toe"] },
    { dutch: "oog", answer: "eye", wrong: ["ear", "nose", "mouth"] },
    { dutch: "oor", answer: "ear", wrong: ["eye", "nose", "mouth"] },
    { dutch: "neus", answer: "nose", wrong: ["mouth", "eye", "ear"] },
    { dutch: "mond", answer: "mouth", wrong: ["nose", "eye", "ear"] },
    { dutch: "vier", answer: "four", wrong: ["five", "three", "six"] },
    { dutch: "vijf", answer: "five", wrong: ["four", "six", "seven"] },
    { dutch: "zes", answer: "six", wrong: ["five", "seven", "eight"] },
    { dutch: "zeven", answer: "seven", wrong: ["six", "eight", "nine"] },
    { dutch: "acht", answer: "eight", wrong: ["seven", "nine", "ten"] },
    { dutch: "negen", answer: "nine", wrong: ["eight", "ten", "seven"] },
    { dutch: "tien", answer: "ten", wrong: ["nine", "eight", "eleven"] },
    { dutch: "zwart", answer: "black", wrong: ["white", "grey", "brown"] },
    { dutch: "wit", answer: "white", wrong: ["black", "grey", "pink"] },
    { dutch: "oranje", answer: "orange", wrong: ["red", "yellow", "pink"] },
    { dutch: "roze", answer: "pink", wrong: ["red", "purple", "white"] },
    { dutch: "dank je", answer: "thanks", wrong: ["please", "sorry", "hello"] },
    { dutch: "school", answer: "school", wrong: ["home", "park", "shop"] },
    { dutch: "auto", answer: "car", wrong: ["bus", "bike", "train"] },
    { dutch: "fiets", answer: "bike", wrong: ["car", "bus", "train"] },
    { dutch: "bloem", answer: "flower", wrong: ["tree", "grass", "leaf"] },
    { dutch: "regen", answer: "rain", wrong: ["snow", "sun", "wind"] },
    { dutch: "ster", answer: "star", wrong: ["moon", "sun", "sky"] },
    { dutch: "doei", answer: "bye", wrong: ["hello", "hi", "thanks"] },
    { dutch: "oma", answer: "grandma", wrong: ["grandpa", "mother", "aunt"] },
  ],

  // Level 3-4: Engels woord → kies Nederlands (omgekeerd)
  mc_reverse: [
    { english: "dog", answer: "hond", wrong: ["kat", "vogel", "vis"] },
    { english: "cat", answer: "kat", wrong: ["hond", "koe", "varken"] },
    { english: "apple", answer: "appel", wrong: ["peer", "banaan", "druif"] },
    { english: "book", answer: "boek", wrong: ["pen", "tas", "school"] },
    { english: "water", answer: "water", wrong: ["melk", "sap", "thee"] },
    { english: "milk", answer: "melk", wrong: ["water", "sap", "limonade"] },
    { english: "mother", answer: "moeder", wrong: ["vader", "oma", "opa"] },
    { english: "father", answer: "vader", wrong: ["moeder", "broer", "zus"] },
    { english: "school", answer: "school", wrong: ["huis", "park", "winkel"] },
    { english: "friend", answer: "vriend", wrong: ["vijand", "buur", "leraar"] },
    { english: "big", answer: "groot", wrong: ["klein", "lang", "kort"] },
    { english: "small", answer: "klein", wrong: ["groot", "dik", "dun"] },
    { english: "happy", answer: "blij", wrong: ["boos", "moe", "bang"] },
    { english: "sad", answer: "verdrietig", wrong: ["blij", "moe", "lief"] },
    { english: "run", answer: "rennen", wrong: ["lopen", "springen", "zitten"] },
    { english: "eat", answer: "eten", wrong: ["drinken", "slapen", "spelen"] },
    { english: "drink", answer: "drinken", wrong: ["eten", "koken", "wassen"] },
    { english: "play", answer: "spelen", wrong: ["werken", "leren", "slapen"] },
    { english: "cow", answer: "koe", wrong: ["paard", "varken", "schaap"] },
    { english: "pig", answer: "varken", wrong: ["koe", "hond", "kat"] },
    { english: "horse", answer: "paard", wrong: ["koe", "ezel", "geit"] },
    { english: "duck", answer: "eend", wrong: ["kip", "gans", "vogel"] },
    { english: "chicken", answer: "kip", wrong: ["eend", "ei", "vogel"] },
    { english: "mouse", answer: "muis", wrong: ["rat", "kat", "hond"] },
    { english: "rabbit", answer: "konijn", wrong: ["haas", "kat", "hond"] },
    { english: "bear", answer: "beer", wrong: ["leeuw", "wolf", "hond"] },
    { english: "lion", answer: "leeuw", wrong: ["tijger", "beer", "kat"] },
    { english: "banana", answer: "banaan", wrong: ["appel", "peer", "druif"] },
    { english: "pear", answer: "peer", wrong: ["appel", "perzik", "pruim"] },
    { english: "bread", answer: "brood", wrong: ["taart", "rijst", "boter"] },
    { english: "cheese", answer: "kaas", wrong: ["melk", "boter", "ei"] },
    { english: "egg", answer: "ei", wrong: ["melk", "brood", "kaas"] },
    { english: "juice", answer: "sap", wrong: ["melk", "water", "fris"] },
    { english: "chair", answer: "stoel", wrong: ["tafel", "bed", "bank"] },
    { english: "table", answer: "tafel", wrong: ["stoel", "bureau", "bed"] },
    { english: "door", answer: "deur", wrong: ["raam", "muur", "vloer"] },
    { english: "window", answer: "raam", wrong: ["deur", "muur", "dak"] },
    { english: "pen", answer: "pen", wrong: ["potlood", "boek", "gum"] },
    { english: "pencil", answer: "potlood", wrong: ["pen", "liniaal", "boek"] },
    { english: "bag", answer: "tas", wrong: ["doos", "hoed", "jas"] },
    { english: "hat", answer: "hoed", wrong: ["pet", "jas", "schoen"] },
    { english: "shoe", answer: "schoen", wrong: ["sok", "hoed", "laars"] },
    { english: "sock", answer: "sok", wrong: ["schoen", "handschoen", "hoed"] },
    { english: "coat", answer: "jas", wrong: ["shirt", "broek", "hoed"] },
    { english: "pants", answer: "broek", wrong: ["shirt", "rok", "jas"] },
    { english: "shirt", answer: "shirt", wrong: ["broek", "jas", "jurk"] },
    { english: "dress", answer: "jurk", wrong: ["rok", "shirt", "jas"] },
    { english: "hand", answer: "hand", wrong: ["voet", "arm", "been"] },
    { english: "foot", answer: "voet", wrong: ["hand", "been", "teen"] },
    { english: "eye", answer: "oog", wrong: ["oor", "neus", "mond"] },
    { english: "ear", answer: "oor", wrong: ["oog", "neus", "mond"] },
    { english: "nose", answer: "neus", wrong: ["mond", "oog", "oor"] },
    { english: "mouth", answer: "mond", wrong: ["neus", "oog", "oor"] },
    { english: "four", answer: "vier", wrong: ["vijf", "drie", "zes"] },
    { english: "five", answer: "vijf", wrong: ["vier", "zes", "zeven"] },
    { english: "six", answer: "zes", wrong: ["vijf", "zeven", "acht"] },
    { english: "seven", answer: "zeven", wrong: ["zes", "acht", "negen"] },
    { english: "eight", answer: "acht", wrong: ["zeven", "negen", "tien"] },
    { english: "nine", answer: "negen", wrong: ["acht", "tien", "zeven"] },
    { english: "ten", answer: "tien", wrong: ["negen", "acht", "elf"] },
    { english: "black", answer: "zwart", wrong: ["wit", "grijs", "bruin"] },
    { english: "white", answer: "wit", wrong: ["zwart", "grijs", "roze"] },
    { english: "orange", answer: "oranje", wrong: ["rood", "geel", "roze"] },
    { english: "pink", answer: "roze", wrong: ["rood", "paars", "wit"] },
    { english: "purple", answer: "paars", wrong: ["blauw", "roze", "groen"] },
    { english: "brown", answer: "bruin", wrong: ["zwart", "groen", "grijs"] },
    { english: "grey", answer: "grijs", wrong: ["zwart", "wit", "bruin"] },
    { english: "night", answer: "nacht", wrong: ["dag", "ochtend", "avond"] },
    { english: "week", answer: "week", wrong: ["dag", "maand", "jaar"] },
    { english: "year", answer: "jaar", wrong: ["maand", "week", "dag"] },
    { english: "thanks", answer: "dank je", wrong: ["alsjeblieft", "sorry", "hallo"] },
    { english: "train", answer: "trein", wrong: ["bus", "auto", "vliegtuig"] },
  ],

  // Level 5-6: zin met keuze — kies het juiste Engelse woord
  mc_sentence: [
    {
      prompt: "I ___ a dog. (Ik heb een hond.)",
      answer: "have",
      wrong: ["has", "am", "is"],
      hint: "Kies het werkwoord voor 'hebben'",
    },
    {
      prompt: "She ___ happy. (Zij is blij.)",
      answer: "is",
      wrong: ["are", "am", "be"],
      hint: "Kies 'is' voor één persoon",
    },
    {
      prompt: "We ___ to school. (Wij gaan naar school.)",
      answer: "go",
      wrong: ["goes", "going", "went"],
      hint: "Werkwoord voor 'gaan'",
    },
    {
      prompt: "The cat ___ on the bed. (De kat ligt op het bed.)",
      answer: "is",
      wrong: ["are", "am", "be"],
      hint: "De kat = één ding → is",
    },
    {
      prompt: "I like ___ apple. (Ik hou van een appel.)",
      answer: "an",
      wrong: ["a", "the", "in"],
      hint: "Voor appel (a-luid) gebruik je 'an'",
    },
    {
      prompt: "It is ___ today. (Het is koud vandaag.)",
      answer: "cold",
      wrong: ["hot", "old", "bold"],
      hint: "Het tegenovergestelde van warm",
    },
    {
      prompt: "My ___ is red. (Mijn bal is rood.)",
      answer: "ball",
      wrong: ["wall", "call", "tall"],
      hint: "Waarmee je kunt spelen",
    },
    {
      prompt: "I see a ___. (Ik zie een vogel.)",
      answer: "bird",
      wrong: ["beard", "bed", "bud"],
      hint: "Dier dat kan vliegen",
    },
    {
      prompt: "He ___ a ball. (Hij heeft een bal.)",
      answer: "has",
      wrong: ["have", "is", "are"],
      hint: "Voor hij/zij gebruik je 'has'",
    },
    {
      prompt: "They ___ cats. (Zij hebben katten.)",
      answer: "have",
      wrong: ["has", "is", "am"],
      hint: "Voor meerdere personen: have",
    },
    {
      prompt: "I ___ to bed. (Ik ga naar bed.)",
      answer: "go",
      wrong: ["goes", "went", "going"],
      hint: "Werkwoord voor gaan",
    },
    {
      prompt: "The dog ___ big. (De hond is groot.)",
      answer: "is",
      wrong: ["are", "am", "be"],
      hint: "De hond = één → is",
    },
    {
      prompt: "We ___ friends. (Wij zijn vrienden.)",
      answer: "are",
      wrong: ["is", "am", "be"],
      hint: "Wij = meerdere → are",
    },
    {
      prompt: "I ___ milk. (Ik drink melk.)",
      answer: "drink",
      wrong: ["drinks", "eat", "have"],
      hint: "Werkwoord voor drinken",
    },
    {
      prompt: "She ___ an apple. (Zij eet een appel.)",
      answer: "eats",
      wrong: ["eat", "drink", "has"],
      hint: "Voor zij/hij eindigt het vaak op -s",
    },
    {
      prompt: "I ___ a book. (Ik lees een boek.)",
      answer: "read",
      wrong: ["reads", "write", "have"],
      hint: "Werkwoord voor lezen",
    },
    {
      prompt: "It is ___ . (Het is warm.)",
      answer: "hot",
      wrong: ["cold", "old", "hat"],
      hint: "Tegenovergestelde van koud",
    },
    {
      prompt: "The sun is ___. (De zon is geel.)",
      answer: "yellow",
      wrong: ["red", "blue", "cold"],
      hint: "Kleur van de zon",
    },
    {
      prompt: "I am ___. (Ik ben blij.)",
      answer: "happy",
      wrong: ["sad", "angry", "tired"],
      hint: "Als je blij bent",
    },
    {
      prompt: "This is ___ cat. (Dit is mijn kat.)",
      answer: "my",
      wrong: ["I", "me", "you"],
      hint: "Van mij = my",
    },
    {
      prompt: "That is ___ dog. (Dat is jouw hond.)",
      answer: "your",
      wrong: ["you", "my", "his"],
      hint: "Van jou = your",
    },
    {
      prompt: "I play ___ the park. (Ik speel in het park.)",
      answer: "in",
      wrong: ["on", "at", "to"],
      hint: "Ergens in → in",
    },
    {
      prompt: "The book is ___ the table. (Het boek ligt op de tafel.)",
      answer: "on",
      wrong: ["in", "at", "under"],
      hint: "Bovenop → on",
    },
    {
      prompt: "I walk ___ school. (Ik loop naar school.)",
      answer: "to",
      wrong: ["at", "in", "on"],
      hint: "Beweging naar → to",
    },
    {
      prompt: "There ___ two dogs. (Er zijn twee honden.)",
      answer: "are",
      wrong: ["is", "am", "be"],
      hint: "Twee honden = meervoud → are",
    },
    {
      prompt: "There ___ one cat. (Er is één kat.)",
      answer: "is",
      wrong: ["are", "am", "be"],
      hint: "Één kat = enkel → is",
    },
    {
      prompt: "I can ___. (Ik kan zwemmen.)",
      answer: "swim",
      wrong: ["swims", "fly", "run"],
      hint: "In het water bewegen",
    },
    {
      prompt: "Birds can ___. (Vogels kunnen vliegen.)",
      answer: "fly",
      wrong: ["swim", "run", "jump"],
      hint: "Door de lucht gaan",
    },
    {
      prompt: "I ___ TV. (Ik kijk tv.)",
      answer: "watch",
      wrong: ["watches", "see", "look"],
      hint: "Kijken naar iets",
    },
    {
      prompt: "We ___ football. (Wij spelen voetbal.)",
      answer: "play",
      wrong: ["plays", "do", "go"],
      hint: "Sport doen = play",
    },
    {
      prompt: "I ___ my teeth. (Ik poets mijn tanden.)",
      answer: "brush",
      wrong: ["brushes", "wash", "clean"],
      hint: "Tanden poetsen",
    },
    {
      prompt: "She ___ a song. (Zij zingt een liedje.)",
      answer: "sings",
      wrong: ["sing", "dance", "play"],
      hint: "Voor zij: sings",
    },
  ],

  // Level 6+: Nederlandse zin → Engelse woorden in volgorde schuiven
  scramble: [
    { dutch: "Ik heb een kat.", words: ["I", "have", "a", "cat"] },
    { dutch: "De hond is groot.", words: ["The", "dog", "is", "big"] },
    { dutch: "Ik ben zes.", words: ["I", "am", "six"] },
    { dutch: "Zij heeft een bal.", words: ["She", "has", "a", "ball"] },
    { dutch: "Wij spelen voetbal.", words: ["We", "play", "football"] },
    { dutch: "Hij rent snel.", words: ["He", "runs", "fast"] },
    { dutch: "Het boek is rood.", words: ["The", "book", "is", "red"] },
    { dutch: "Ik eet een appel.", words: ["I", "eat", "an", "apple"] },
    { dutch: "Mijn kat is klein.", words: ["My", "cat", "is", "small"] },
    { dutch: "De zon is geel.", words: ["The", "sun", "is", "yellow"] },
    { dutch: "Ik ga naar school.", words: ["I", "go", "to", "school"] },
    { dutch: "Zij drinkt water.", words: ["She", "drinks", "water"] },
    { dutch: "Hij heeft een hond.", words: ["He", "has", "a", "dog"] },
    { dutch: "Ik hou van pizza.", words: ["I", "love", "pizza"] },
    { dutch: "Wij zijn vrienden.", words: ["We", "are", "friends"] },
    { dutch: "De bal is blauw.", words: ["The", "ball", "is", "blue"] },
    { dutch: "Ik kan zwemmen.", words: ["I", "can", "swim"] },
    { dutch: "Zij zingt een lied.", words: ["She", "sings", "a", "song"] },
    { dutch: "Ik drink melk.", words: ["I", "drink", "milk"] },
    { dutch: "De vogel kan vliegen.", words: ["The", "bird", "can", "fly"] },
    { dutch: "Ik zie een vis.", words: ["I", "see", "a", "fish"] },
    { dutch: "Wij lezen een boek.", words: ["We", "read", "a", "book"] },
    { dutch: "Het is koud.", words: ["It", "is", "cold"] },
    { dutch: "Hij speelt gitaar.", words: ["He", "plays", "guitar"] },
    { dutch: "Ik kijk tv.", words: ["I", "watch", "TV"] },
    { dutch: "De kat slaapt.", words: ["The", "cat", "sleeps"] },
    { dutch: "Zij is blij.", words: ["She", "is", "happy"] },
    { dutch: "Wij eten brood.", words: ["We", "eat", "bread"] },
    { dutch: "Hij is mijn vriend.", words: ["He", "is", "my", "friend"] },
    { dutch: "Ik heb een pen.", words: ["I", "have", "a", "pen"] },
  ],

  // Level 7+: invuloefeningen
  fill_blank: [
    {
      sentence: "I ___ a cat.",
      translation: "Ik heb een kat.",
      answer: "have",
      accept: ["have"],
    },
    {
      sentence: "The dog is ___ the house.",
      translation: "De hond is in het huis.",
      answer: "in",
      accept: ["in"],
    },
    {
      sentence: "She ___ my friend.",
      translation: "Zij is mijn vriendin.",
      answer: "is",
      accept: ["is"],
    },
    {
      sentence: "We ___ to the park.",
      translation: "Wij gaan naar het park.",
      answer: "go",
      accept: ["go"],
    },
    {
      sentence: "I ___ water.",
      translation: "Ik drink water.",
      answer: "drink",
      accept: ["drink"],
    },
    {
      sentence: "The ball is ___ the table.",
      translation: "De bal ligt op de tafel.",
      answer: "on",
      accept: ["on"],
    },
    {
      sentence: "He ___ a book.",
      translation: "Hij leest een boek.",
      answer: "reads",
      accept: ["reads", "read"],
    },
    {
      sentence: "They ___ happy.",
      translation: "Zij zijn blij.",
      answer: "are",
      accept: ["are"],
    },
    {
      sentence: "My cat is ___.",
      translation: "Mijn kat is klein.",
      answer: "small",
      accept: ["small", "little"],
    },
    {
      sentence: "I ___ English.",
      translation: "Ik leer Engels.",
      answer: "learn",
      accept: ["learn", "study"],
    },
    {
      sentence: "The bird can ___.",
      translation: "De vogel kan vliegen.",
      answer: "fly",
      accept: ["fly"],
    },
    {
      sentence: "It is ___ outside.",
      translation: "Het is warm buiten.",
      answer: "warm",
      accept: ["warm", "hot"],
    },
    {
      sentence: "I ___ breakfast.",
      translation: "Ik eet ontbijt.",
      answer: "eat",
      accept: ["eat", "have"],
    },
    {
      sentence: "She ___ TV.",
      translation: "Zij kijkt tv.",
      answer: "watches",
      accept: ["watches", "watch"],
    },
    {
      sentence: "We ___ football.",
      translation: "Wij spelen voetbal.",
      answer: "play",
      accept: ["play"],
    },
    {
      sentence: "He ___ fast.",
      translation: "Hij rent snel.",
      answer: "runs",
      accept: ["runs", "run"],
    },
    {
      sentence: "The cat ___ on the chair.",
      translation: "De kat zit op de stoel.",
      answer: "sits",
      accept: ["sits", "sit", "is"],
    },
    {
      sentence: "I ___ my room.",
      translation: "Ik ruim mijn kamer op.",
      answer: "clean",
      accept: ["clean", "tidy"],
    },
    {
      sentence: "They ___ a song.",
      translation: "Zij zingen een liedje.",
      answer: "sing",
      accept: ["sing"],
    },
    {
      sentence: "I ___ to music.",
      translation: "Ik luister naar muziek.",
      answer: "listen",
      accept: ["listen"],
    },
    {
      sentence: "She ___ a picture.",
      translation: "Zij tekent een plaatje.",
      answer: "draws",
      accept: ["draws", "draw"],
    },
    {
      sentence: "We ___ home.",
      translation: "Wij gaan naar huis.",
      answer: "go",
      accept: ["go"],
    },
    {
      sentence: "The dog ___ under the table.",
      translation: "De hond ligt onder de tafel.",
      answer: "is",
      accept: ["is", "lies"],
    },
    {
      sentence: "I ___ my hands.",
      translation: "Ik was mijn handen.",
      answer: "wash",
      accept: ["wash"],
    },
    {
      sentence: "He ___ a bike.",
      translation: "Hij fietst.",
      answer: "rides",
      accept: ["rides", "ride"],
    },
    {
      sentence: "It is ___ today.",
      translation: "Het regent vandaag.",
      answer: "raining",
      accept: ["raining", "rainy"],
    },
    {
      sentence: "I am ___ years old.",
      translation: "Ik ben zeven jaar.",
      answer: "seven",
      accept: ["seven", "7"],
    },
    {
      sentence: "My dog is very ___.",
      translation: "Mijn hond is erg lief.",
      answer: "nice",
      accept: ["nice", "sweet", "kind"],
    },
    {
      sentence: "This book is ___.",
      translation: "Dit boek is leuk.",
      answer: "fun",
      accept: ["fun", "nice", "good"],
    },
    {
      sentence: "I ___ tired.",
      translation: "Ik ben moe.",
      answer: "am",
      accept: ["am", "feel"],
    },
    {
      sentence: "You ___ my friend.",
      translation: "Jij bent mijn vriend.",
      answer: "are",
      accept: ["are"],
    },
    {
      sentence: "The birds are in the ___.",
      translation: "De vogels zitten in de boom.",
      answer: "tree",
      accept: ["tree"],
    },
    {
      sentence: "I put the ball ___ the box.",
      translation: "Ik leg de bal in de doos.",
      answer: "in",
      accept: ["in"],
    },
    {
      sentence: "She walks ___ the school.",
      translation: "Zij loopt naar school.",
      answer: "to",
      accept: ["to"],
    },
    {
      sentence: "We eat lunch ___ noon.",
      translation: "Wij eten lunch om twaalf uur.",
      answer: "at",
      accept: ["at"],
    },
    {
      sentence: "I sleep ___ night.",
      translation: "Ik slaap 's nachts.",
      answer: "at",
      accept: ["at", "in"],
    },
    {
      sentence: "Can you ___ me?",
      translation: "Kun je me helpen?",
      answer: "help",
      accept: ["help"],
    },
    {
      sentence: "I ___ my mum.",
      translation: "Ik hou van mijn mama.",
      answer: "love",
      accept: ["love", "like"],
    },
    {
      sentence: "Do not ___ !",
      translation: "Niet rennen!",
      answer: "run",
      accept: ["run"],
    },
    {
      sentence: "Please ___ down.",
      translation: "Ga alsjeblieft zitten.",
      answer: "sit",
      accept: ["sit"],
    },
    {
      sentence: "Stand ___ , please.",
      translation: "Sta op, alsjeblieft.",
      answer: "up",
      accept: ["up"],
    },
    {
      sentence: "I ___ a letter.",
      translation: "Ik schrijf een brief.",
      answer: "write",
      accept: ["write"],
    },
    {
      sentence: "He opens the ___.",
      translation: "Hij opent het raam.",
      answer: "window",
      accept: ["window"],
    },
    {
      sentence: "The milk is in the ___.",
      translation: "De melk staat in de koelkast.",
      answer: "fridge",
      accept: ["fridge", "refrigerator"],
    },
    {
      sentence: "I see three ___.",
      translation: "Ik zie drie vogels.",
      answer: "birds",
      accept: ["birds", "bird"],
    },
    {
      sentence: "Her dress is ___.",
      translation: "Haar jurk is roze.",
      answer: "pink",
      accept: ["pink"],
    },
    {
      sentence: "We are at the ___.",
      translation: "Wij zijn op school.",
      answer: "school",
      accept: ["school"],
    },
    {
      sentence: "I need a ___.",
      translation: "Ik heb water nodig.",
      answer: "drink",
      accept: ["drink"],
    },
  ],
};

const ENEMIES = [
  { id: "robot", name: "Slome Steve", minLevel: 1 },
  { id: "balloon", name: "Bouncy Bob", minLevel: 3 },
  { id: "skibidi", name: "Skibidi Sam", minLevel: 5 },
  { id: "cool", name: "Rizz Rick", minLevel: 8 },
  { id: "sigma", name: "Sigma Sven", minLevel: 12 },
  { id: "corn", name: "Ohio Oscar", minLevel: 15 },
];

/** Bokser-skins per level — attackDamage = schade bij goed antwoord */
const FIGHTER_SKINS = [
  { id: "beginner", minLevel: 1, title: "Beginneling", attackDamage: 25 },
  { id: "strong", minLevel: 3, title: "Sterkeling", attackDamage: 30 },
  { id: "lightning", minLevel: 5, title: "Bliksem", attackDamage: 34 },
  { id: "fire", minLevel: 8, title: "Vuist van Vuur", attackDamage: 38 },
  { id: "champion", minLevel: 12, title: "Kampioen", attackDamage: 42 },
  { id: "legend", minLevel: 18, title: "Legende", attackDamage: 48 },
];

const COMBAT = {
  playerMaxHp: 100,
  /** Goede antwoorden nodig voor de eerste bokser; +1 per upgrade */
  baseHitsToWin: 4,
  enemyAttackDamage: 20,
};

function getFighterTierIndex(level) {
  let idx = 0;
  for (let i = 0; i < FIGHTER_SKINS.length; i++) {
    if (level >= FIGHTER_SKINS[i].minLevel) idx = i;
  }
  return idx;
}

function getHitsToWin(level) {
  return COMBAT.baseHitsToWin + getFighterTierIndex(level);
}

function getPlayerAttackDamage(level) {
  return getFighterSkin(level).attackDamage;
}

/** Vijand-HP = precies genoeg voor hitsToWin × schade (HP-balk = knock-out-voortgang) */
function getEnemyMaxHp(level) {
  return getHitsToWin(level) * getPlayerAttackDamage(level);
}

function getFighterSkin(level) {
  let skin = FIGHTER_SKINS[0];
  for (const s of FIGHTER_SKINS) {
    if (level >= s.minLevel) skin = s;
  }
  return skin;
}

/** Voortgang op de ontgrendel-balk (0–100) en status per bokser */
function getUnlockTrackData(xp) {
  const { level } = getLevelFromXp(xp);
  const currentSkin = getFighterSkin(level);
  const skins = FIGHTER_SKINS.map((skin) => ({
    ...skin,
    unlocked: level >= skin.minLevel,
    current: skin.minLevel === currentSkin.minLevel,
  }));

  const unlockedCount = skins.filter((s) => s.unlocked).length;
  let fillPercent = 100;

  if (unlockedCount < skins.length) {
    const segments = skins.length - 1;
    const lastUnlocked = skins[unlockedCount - 1];
    const nextLocked = skins[unlockedCount];
    const xpStart = totalXpToReachLevel(lastUnlocked.minLevel);
    const xpEnd = totalXpToReachLevel(nextLocked.minLevel);
    const segmentProgress =
      xpEnd > xpStart ? Math.min(1, Math.max(0, (xp - xpStart) / (xpEnd - xpStart))) : 0;
    fillPercent =
      ((unlockedCount - 1) / segments) * 100 + (segmentProgress / segments) * 100;
  }

  const nextLocked = skins.find((s) => !s.unlocked);
  let nextHint = "Alle boksers ontgrendeld! Je bent een legende! 🐉";

  if (nextLocked) {
    const xpNeeded = totalXpToReachLevel(nextLocked.minLevel) - xp;
    nextHint = `Nog ${Math.max(0, xpNeeded)} XP tot ${nextLocked.title} (level ${nextLocked.minLevel})`;
  }

  return { fillPercent, skins, nextHint };
}

function getEnemyForLevel(level) {
  let enemy = ENEMIES[0];
  for (const e of ENEMIES) {
    if (level >= e.minLevel) enemy = e;
  }
  return enemy;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Vanaf dit level: invuloefeningen (hoogste bokser-tier) */
const FILL_BLANK_MIN_LEVEL = Math.max(...FIGHTER_SKINS.map((s) => s.minLevel));

/**
 * Bepaalt vraagtype op basis van spelerslevel
 * 1-2: mc_easy
 * 3-4: mix easy + reverse
 * 5: zinnen + mix (geen invullen, geen schuiven)
 * 6 t/m hoogste-1: ook woorden schuiven
 * hoogste level (18+): vooral invullen + schuiven
 */
function generateQuestion(playerLevel, round = 1) {
  if (playerLevel <= 2) {
    return buildMcEasy();
  }
  if (playerLevel <= 4) {
    return Math.random() < 0.5 ? buildMcEasy() : buildMcReverse();
  }
  if (playerLevel < FILL_BLANK_MIN_LEVEL) {
    const roll = Math.random();
    if (roll < 0.15) return buildMcEasy();
    if (roll < 0.35) return buildMcReverse();
    if (roll < 0.55) return buildMcSentence();
    if (playerLevel >= 6) return buildScramble(round, playerLevel);
    return buildMcSentence();
  }
  const roll = Math.random();
  if (roll < 0.65) return buildFillBlank();
  if (roll < 0.85) return buildScramble(round, playerLevel);
  return buildMcSentence();
}

function buildMcEasy() {
  const q = pickRandom(QUESTION_POOL.mc_easy);
  const options = shuffle([q.answer, ...q.wrong]);
  return {
    type: "mc",
    typeLabel: "Kies het Engelse woord",
    prompt: `Wat is het Engelse woord voor "<strong>${q.dutch}</strong>"?`,
    options,
    answer: q.answer,
    hint: `Denk aan: ${q.dutch} → ?`,
  };
}

function buildMcReverse() {
  const q = pickRandom(QUESTION_POOL.mc_reverse);
  const options = shuffle([q.answer, ...q.wrong]);
  return {
    type: "mc",
    typeLabel: "Kies het Nederlandse woord",
    prompt: `Wat betekent "<strong>${q.english}</strong>" in het Nederlands?`,
    options,
    answer: q.answer,
    hint: `Engels: ${q.english}`,
  };
}

function buildMcSentence() {
  const q = pickRandom(QUESTION_POOL.mc_sentence);
  const options = shuffle([q.answer, ...q.wrong]);
  return {
    type: "mc",
    typeLabel: "Kies het juiste woord in de zin",
    prompt: q.prompt,
    options,
    answer: q.answer,
    hint: q.hint || "",
  };
}

function getScrambleDistractors(correctWords, count) {
  const correctSet = new Set(correctWords.map((w) => w.toLowerCase()));
  const vocab = Array.from(
    new Set(
      QUESTION_POOL.scramble.flatMap((entry) => entry.words).filter((word) => {
        return !correctSet.has(word.toLowerCase());
      })
    )
  );
  return shuffle(vocab).slice(0, count);
}

function buildScramble(round = 1, playerLevel = 1) {
  const q = pickRandom(QUESTION_POOL.scramble);
  const correctWords = [...q.words];
  const shouldAddDistractors = round >= 13 || playerLevel >= 13;
  const extraWords = shouldAddDistractors ? getScrambleDistractors(correctWords, 2) : [];
  const bankWords = shuffle([...correctWords, ...extraWords]);

  return {
    type: "scramble",
    typeLabel: "Zet de Engelse woorden in de juiste volgorde",
    translation: q.dutch,
    words: correctWords,
    bankWords,
    answer: q.words.join(" "),
    prompt: "",
    hint: "",
  };
}

function buildFillBlank() {
  const q = pickRandom(QUESTION_POOL.fill_blank);
  const display = q.sentence.replace("___", '<span class="blank">???</span>');
  return {
    type: "fill",
    typeLabel: "Vul het ontbrekende woord in",
    prompt: display,
    translation: q.translation,
    answer: q.answer,
    accept: q.accept.map((a) => a.toLowerCase()),
    hint: "",
  };
}

function xpForLevel(level) {
  return 40 + level * 25;
}

function totalXpToReachLevel(level) {
  let total = 0;
  for (let l = 1; l < level; l++) {
    total += xpForLevel(l);
  }
  return total;
}

function getLevelFromXp(xp) {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, progress: remaining, needed: xpForLevel(level) };
}
