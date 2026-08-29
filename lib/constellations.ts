export type ConstellationView = "pattern" | "stars";

export type ConstellationStar = {
  id: string;
  name: string;
  designation: string;
  x: number;
  y: number;
  magnitude: number;
  featured?: boolean;
};

export type ConstellationEdge = readonly [from: string, to: string];

export type ConstellationSource = {
  label: string;
  url: string;
};

export type Constellation = {
  id: string;
  slug: string;
  orderAlongEcliptic: number;
  name: string;
  vietnameseName: string;
  iauAbbreviation: string;
  symbol: string;
  accent: string;
  meaning: string;
  shortDescription: string;
  overview: string;
  recognitionGuide: string;
  brightestStar: string;
  eveningPeak: string;
  astronomyNote: string;
  isTraditionalZodiac: boolean;
  isCrossedByEcliptic: true;
  stars: ConstellationStar[];
  edges: ConstellationEdge[];
};

export const constellationSources: ConstellationSource[] = [
  {
    label: "International Astronomical Union — Constellations",
    url: "https://www.iau.org/public/themes/constellations/",
  },
  {
    label: "International Astronomical Union — Astronomy FAQ",
    url: "https://www.iau.org/IAU/IAU/Astronomy-FAQs/FAQs.aspx",
  },
  {
    label: "NASA Space Place — What Are Constellations?",
    url: "https://spaceplace.nasa.gov/constellations/en/",
  },
];

export const constellations: Constellation[] = [
  {
    id: "z01",
    slug: "aries",
    orderAlongEcliptic: 1,
    name: "Aries",
    vietnameseName: "Bạch Dương",
    iauAbbreviation: "Ari",
    symbol: "♈",
    accent: "#ef9a78",
    meaning: "The Ram",
    shortDescription: "A compact, bent line of stars led by warm-toned Hamal.",
    overview:
      "Aries is a modest constellation whose clearest guide is a short curve of three stars. It is much quieter than the bold zodiac symbol that carries its name.",
    recognitionGuide:
      "Find Hamal first, then follow the shallow bend through Sheratan and Mesarthim.",
    brightestStar: "Hamal",
    eveningPeak: "November–December",
    astronomyNote:
      "The March equinox once lay in Aries, but Earth’s slow axial precession has shifted that reference point into Pisces.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "mesarthim", name: "Mesarthim", designation: "γ Ari", x: 18, y: 56, magnitude: 3.9 },
      { id: "sheratan", name: "Sheratan", designation: "β Ari", x: 31, y: 51, magnitude: 2.6 },
      { id: "hamal", name: "Hamal", designation: "α Ari", x: 47, y: 43, magnitude: 2.0, featured: true },
      { id: "botein", name: "Botein", designation: "δ Ari", x: 71, y: 59, magnitude: 4.4 },
      { id: "ari41", name: "41 Arietis", designation: "41 Ari", x: 86, y: 37, magnitude: 3.6 },
    ],
    edges: [["mesarthim", "sheratan"], ["sheratan", "hamal"], ["hamal", "botein"], ["botein", "ari41"]],
  },
  {
    id: "z02",
    slug: "taurus",
    orderAlongEcliptic: 2,
    name: "Taurus",
    vietnameseName: "Kim Ngưu",
    iauAbbreviation: "Tau",
    symbol: "♉",
    accent: "#e7b768",
    meaning: "The Bull",
    shortDescription: "A bright V-shaped face with Aldebaran glowing at one edge.",
    overview:
      "Taurus is one of the easiest zodiac constellations to recognize. Its face follows the V of the Hyades, while two long lines suggest the bull’s horns.",
    recognitionGuide:
      "Look for orange Aldebaran beside the Hyades V, then trace the horn toward Elnath.",
    brightestStar: "Aldebaran",
    eveningPeak: "December–January",
    astronomyNote:
      "The Pleiades and Hyades make Taurus rich in open clusters, although Aldebaran only appears in front of the Hyades and is not a member of it.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "elnath", name: "Elnath", designation: "β Tau", x: 18, y: 18, magnitude: 1.7 },
      { id: "ain", name: "Ain", designation: "ε Tau", x: 36, y: 38, magnitude: 3.5 },
      { id: "hyadum", name: "Hyadum I", designation: "γ Tau", x: 45, y: 48, magnitude: 3.7 },
      { id: "aldebaran", name: "Aldebaran", designation: "α Tau", x: 58, y: 57, magnitude: 0.9, featured: true },
      { id: "theta", name: "Theta Tauri", designation: "θ Tau", x: 44, y: 61, magnitude: 3.4 },
      { id: "alcyone", name: "Alcyone", designation: "η Tau", x: 19, y: 78, magnitude: 2.9 },
      { id: "zeta", name: "Zeta Tauri", designation: "ζ Tau", x: 84, y: 76, magnitude: 3.0 },
    ],
    edges: [["elnath", "ain"], ["ain", "hyadum"], ["hyadum", "aldebaran"], ["hyadum", "theta"], ["theta", "alcyone"], ["aldebaran", "zeta"]],
  },
  {
    id: "z03",
    slug: "gemini",
    orderAlongEcliptic: 3,
    name: "Gemini",
    vietnameseName: "Song Tử",
    iauAbbreviation: "Gem",
    symbol: "♊",
    accent: "#9ecde0",
    meaning: "The Twins",
    shortDescription: "Two near-parallel trails descend from Castor and Pollux.",
    overview:
      "Gemini is anchored by the bright pair Castor and Pollux. Fainter stars extend away from them like two figures standing side by side.",
    recognitionGuide:
      "Start with Castor and slightly brighter Pollux, then follow their two loose chains toward Orion.",
    brightestStar: "Pollux",
    eveningPeak: "January–February",
    astronomyNote:
      "Castor looks like one star to unaided eyes but is a remarkable multiple-star system.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "castor", name: "Castor", designation: "α Gem", x: 25, y: 17, magnitude: 1.6 },
      { id: "pollux", name: "Pollux", designation: "β Gem", x: 58, y: 22, magnitude: 1.1, featured: true },
      { id: "mebsuta", name: "Mebsuta", designation: "ε Gem", x: 31, y: 40, magnitude: 3.1 },
      { id: "wasat", name: "Wasat", designation: "δ Gem", x: 55, y: 47, magnitude: 3.5 },
      { id: "tejat", name: "Tejat", designation: "μ Gem", x: 23, y: 69, magnitude: 2.9 },
      { id: "alhena", name: "Alhena", designation: "γ Gem", x: 61, y: 70, magnitude: 1.9 },
      { id: "mekbuda", name: "Mekbuda", designation: "ζ Gem", x: 79, y: 86, magnitude: 3.8 },
    ],
    edges: [["castor", "mebsuta"], ["mebsuta", "tejat"], ["pollux", "wasat"], ["wasat", "alhena"], ["mebsuta", "wasat"], ["alhena", "mekbuda"]],
  },
  {
    id: "z04",
    slug: "cancer",
    orderAlongEcliptic: 4,
    name: "Cancer",
    vietnameseName: "Cự Giải",
    iauAbbreviation: "Cnc",
    symbol: "♋",
    accent: "#b7a6dd",
    meaning: "The Crab",
    shortDescription: "A faint, open Y surrounding the soft glow of the Beehive.",
    overview:
      "Cancer has no very bright stars. Its subtle Y-shaped pattern rewards darker skies, and the Beehive Cluster gives the constellation its most memorable sight.",
    recognitionGuide:
      "Look between Gemini and Leo, then use binoculars to locate the hazy Beehive Cluster near the center.",
    brightestStar: "Tarf",
    eveningPeak: "February–March",
    astronomyNote:
      "The Beehive Cluster, also called Praesepe or Messier 44, is an open cluster visible as a misty patch to unaided eyes under dark skies.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "iota", name: "Iota Cancri", designation: "ι Cnc", x: 49, y: 17, magnitude: 4.0 },
      { id: "asellus-b", name: "Asellus Borealis", designation: "γ Cnc", x: 39, y: 40, magnitude: 4.7 },
      { id: "asellus-a", name: "Asellus Australis", designation: "δ Cnc", x: 52, y: 53, magnitude: 3.9 },
      { id: "acubens", name: "Acubens", designation: "α Cnc", x: 27, y: 79, magnitude: 4.3 },
      { id: "tarf", name: "Tarf", designation: "β Cnc", x: 72, y: 80, magnitude: 3.5, featured: true },
    ],
    edges: [["iota", "asellus-b"], ["asellus-b", "asellus-a"], ["asellus-a", "acubens"], ["asellus-a", "tarf"]],
  },
  {
    id: "z05",
    slug: "leo",
    orderAlongEcliptic: 5,
    name: "Leo",
    vietnameseName: "Sư Tử",
    iauAbbreviation: "Leo",
    symbol: "♌",
    accent: "#f0ae5e",
    meaning: "The Lion",
    shortDescription: "A backward question mark rises from Regulus into a triangle.",
    overview:
      "Leo’s head and mane form the Sickle, a backward question-mark curve. A triangle extending eastward completes the lion’s body and tail.",
    recognitionGuide:
      "Find bright Regulus at the base of the Sickle, then trace the broad triangle to Denebola.",
    brightestStar: "Regulus",
    eveningPeak: "March–April",
    astronomyNote:
      "Regulus lies very close to the ecliptic, so the Moon and planets regularly pass near it from our viewpoint.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "regulus", name: "Regulus", designation: "α Leo", x: 17, y: 73, magnitude: 1.4, featured: true },
      { id: "algieba", name: "Algieba", designation: "γ Leo", x: 34, y: 46, magnitude: 2.1 },
      { id: "adhafera", name: "Adhafera", designation: "ζ Leo", x: 27, y: 27, magnitude: 3.4 },
      { id: "rasalas", name: "Rasalas", designation: "μ Leo", x: 43, y: 15, magnitude: 3.9 },
      { id: "zosma", name: "Zosma", designation: "δ Leo", x: 58, y: 43, magnitude: 2.6 },
      { id: "chertan", name: "Chertan", designation: "θ Leo", x: 69, y: 61, magnitude: 3.3 },
      { id: "denebola", name: "Denebola", designation: "β Leo", x: 87, y: 45, magnitude: 2.1 },
    ],
    edges: [["regulus", "algieba"], ["algieba", "adhafera"], ["adhafera", "rasalas"], ["regulus", "chertan"], ["chertan", "zosma"], ["zosma", "denebola"], ["denebola", "chertan"]],
  },
  {
    id: "z06",
    slug: "virgo",
    orderAlongEcliptic: 6,
    name: "Virgo",
    vietnameseName: "Xử Nữ",
    iauAbbreviation: "Vir",
    symbol: "♍",
    accent: "#9cc6aa",
    meaning: "The Maiden",
    shortDescription: "A sprawling tilted figure ending at brilliant blue-white Spica.",
    overview:
      "Virgo covers a large region of sky. Its outline is broad and understated, but Spica provides a bright southern anchor.",
    recognitionGuide:
      "Follow the arc of the Big Dipper’s handle to Arcturus, then continue the same curve to Spica.",
    brightestStar: "Spica",
    eveningPeak: "April–May",
    astronomyNote:
      "The direction of Virgo contains the Virgo Cluster, a vast gathering of galaxies far beyond the foreground stars of the constellation.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "vindemiatrix", name: "Vindemiatrix", designation: "ε Vir", x: 20, y: 20, magnitude: 2.8 },
      { id: "porrima", name: "Porrima", designation: "γ Vir", x: 43, y: 46, magnitude: 2.7 },
      { id: "zaniah", name: "Zaniah", designation: "η Vir", x: 31, y: 58, magnitude: 3.9 },
      { id: "zavijava", name: "Zavijava", designation: "β Vir", x: 15, y: 73, magnitude: 3.6 },
      { id: "heze", name: "Heze", designation: "ζ Vir", x: 73, y: 55, magnitude: 3.4 },
      { id: "spica", name: "Spica", designation: "α Vir", x: 66, y: 82, magnitude: 1.0, featured: true },
      { id: "auva", name: "Auva", designation: "δ Vir", x: 56, y: 33, magnitude: 3.4 },
    ],
    edges: [["vindemiatrix", "auva"], ["auva", "porrima"], ["porrima", "zaniah"], ["zaniah", "zavijava"], ["porrima", "heze"], ["heze", "spica"]],
  },
  {
    id: "z07",
    slug: "libra",
    orderAlongEcliptic: 7,
    name: "Libra",
    vietnameseName: "Thiên Bình",
    iauAbbreviation: "Lib",
    symbol: "♎",
    accent: "#e7a9bb",
    meaning: "The Scales",
    shortDescription: "A clean four-star diamond balances between Virgo and Scorpius.",
    overview:
      "Libra is drawn as a tilted quadrilateral. Its Arabic star names preserve an older association with the claws of neighboring Scorpius.",
    recognitionGuide:
      "Look between Spica and Antares for a balanced diamond of medium-bright stars.",
    brightestStar: "Zubeneschamali",
    eveningPeak: "May–June",
    astronomyNote:
      "Libra is the only traditional zodiac constellation represented by an inanimate object rather than a person or animal.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "zubeneschamali", name: "Zubeneschamali", designation: "β Lib", x: 60, y: 20, magnitude: 2.6, featured: true },
      { id: "zubenelgenubi", name: "Zubenelgenubi", designation: "α Lib", x: 32, y: 45, magnitude: 2.8 },
      { id: "zubenelhakrabi", name: "Zubenelhakrabi", designation: "γ Lib", x: 77, y: 53, magnitude: 3.9 },
      { id: "brachium", name: "Brachium", designation: "σ Lib", x: 50, y: 82, magnitude: 3.3 },
      { id: "upsilon", name: "Upsilon Librae", designation: "υ Lib", x: 86, y: 77, magnitude: 3.6 },
    ],
    edges: [["zubeneschamali", "zubenelgenubi"], ["zubenelgenubi", "brachium"], ["brachium", "zubenelhakrabi"], ["zubenelhakrabi", "zubeneschamali"], ["zubenelhakrabi", "upsilon"]],
  },
  {
    id: "z08",
    slug: "scorpius",
    orderAlongEcliptic: 8,
    name: "Scorpius",
    vietnameseName: "Bọ Cạp",
    iauAbbreviation: "Sco",
    symbol: "♏",
    accent: "#e77459",
    meaning: "The Scorpion",
    shortDescription: "A red heart and a long hooked tail make a rare name-like shape.",
    overview:
      "Scorpius is one of the sky’s most recognizable figures. Antares marks its heart while a bright chain curls down into the stinger.",
    recognitionGuide:
      "Find orange-red Antares, then follow the dense chain southward to the close pair Shaula and Lesath.",
    brightestStar: "Antares",
    eveningPeak: "June–July",
    astronomyNote:
      "Scorpius lies against a rich Milky Way field filled with star clusters and nebulae, especially toward its curved tail.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "jabbah", name: "Jabbah", designation: "ν Sco", x: 18, y: 14, magnitude: 2.9 },
      { id: "acrab", name: "Acrab", designation: "β Sco", x: 28, y: 19, magnitude: 2.6 },
      { id: "dschubba", name: "Dschubba", designation: "δ Sco", x: 38, y: 30, magnitude: 2.3 },
      { id: "antares", name: "Antares", designation: "α Sco", x: 50, y: 43, magnitude: 1.1, featured: true },
      { id: "alniyat", name: "Alniyat", designation: "σ Sco", x: 56, y: 53, magnitude: 2.9 },
      { id: "sargas", name: "Sargas", designation: "θ Sco", x: 67, y: 69, magnitude: 1.9 },
      { id: "shaula", name: "Shaula", designation: "λ Sco", x: 54, y: 85, magnitude: 1.6 },
      { id: "lesath", name: "Lesath", designation: "υ Sco", x: 45, y: 88, magnitude: 2.7 },
    ],
    edges: [["jabbah", "dschubba"], ["acrab", "dschubba"], ["dschubba", "antares"], ["antares", "alniyat"], ["alniyat", "sargas"], ["sargas", "shaula"], ["shaula", "lesath"]],
  },
  {
    id: "z09",
    slug: "sagittarius",
    orderAlongEcliptic: 9,
    name: "Sagittarius",
    vietnameseName: "Nhân Mã",
    iauAbbreviation: "Sgr",
    symbol: "♐",
    accent: "#d9b46f",
    meaning: "The Archer",
    shortDescription: "Its central stars form the famous Teapot beside the Milky Way.",
    overview:
      "Sagittarius is easier to learn as the Teapot than as an archer. Its compact central pattern appears to pour the Milky Way’s steam into the summer sky.",
    recognitionGuide:
      "Search the bright Milky Way east of Scorpius for a tilted teapot with a triangular spout.",
    brightestStar: "Kaus Australis",
    eveningPeak: "July–August",
    astronomyNote:
      "The center of the Milky Way lies in the direction of Sagittarius, hidden at visible wavelengths by thick lanes of interstellar dust.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "polis", name: "Polis", designation: "μ Sgr", x: 20, y: 16, magnitude: 3.8 },
      { id: "kaus-b", name: "Kaus Borealis", designation: "λ Sgr", x: 42, y: 24, magnitude: 2.8 },
      { id: "nunki", name: "Nunki", designation: "σ Sgr", x: 76, y: 30, magnitude: 2.0 },
      { id: "kaus-m", name: "Kaus Media", designation: "δ Sgr", x: 47, y: 47, magnitude: 2.7 },
      { id: "ascella", name: "Ascella", designation: "ζ Sgr", x: 68, y: 57, magnitude: 2.6 },
      { id: "alnasl", name: "Alnasl", designation: "γ Sgr", x: 28, y: 64, magnitude: 3.0 },
      { id: "kaus-a", name: "Kaus Australis", designation: "ε Sgr", x: 50, y: 76, magnitude: 1.8, featured: true },
    ],
    edges: [["polis", "kaus-b"], ["kaus-b", "nunki"], ["nunki", "ascella"], ["ascella", "kaus-a"], ["kaus-a", "alnasl"], ["alnasl", "kaus-m"], ["kaus-m", "kaus-b"], ["kaus-m", "ascella"]],
  },
  {
    id: "z10",
    slug: "capricornus",
    orderAlongEcliptic: 10,
    name: "Capricornus",
    vietnameseName: "Ma Kết",
    iauAbbreviation: "Cap",
    symbol: "♑",
    accent: "#87b8b2",
    meaning: "The Sea-Goat",
    shortDescription: "A broad, faint triangle stretches across a quiet southern field.",
    overview:
      "Capricornus is a large but faint triangular outline. Its traditional sea-goat figure takes patience and relatively dark skies to trace.",
    recognitionGuide:
      "Look east of Sagittarius for a wide, shallow triangle anchored by Algedi and Deneb Algedi.",
    brightestStar: "Deneb Algedi",
    eveningPeak: "August–September",
    astronomyNote:
      "The constellation gives its name to the Tropic of Capricorn, although precession has moved the December-solstice Sun into Sagittarius.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "algedi", name: "Algedi", designation: "α Cap", x: 17, y: 31, magnitude: 3.6 },
      { id: "dabih", name: "Dabih", designation: "β Cap", x: 32, y: 38, magnitude: 3.1 },
      { id: "omega", name: "Omega Capricorni", designation: "ω Cap", x: 49, y: 83, magnitude: 4.1 },
      { id: "nashira", name: "Nashira", designation: "γ Cap", x: 69, y: 62, magnitude: 3.7 },
      { id: "deneb-algedi", name: "Deneb Algedi", designation: "δ Cap", x: 86, y: 47, magnitude: 2.9, featured: true },
    ],
    edges: [["algedi", "dabih"], ["dabih", "omega"], ["omega", "nashira"], ["nashira", "deneb-algedi"], ["deneb-algedi", "algedi"]],
  },
  {
    id: "z11",
    slug: "aquarius",
    orderAlongEcliptic: 11,
    name: "Aquarius",
    vietnameseName: "Bảo Bình",
    iauAbbreviation: "Aqr",
    symbol: "♒",
    accent: "#72b8d5",
    meaning: "The Water Bearer",
    shortDescription: "A small Water Jar opens into long streams of faint stars.",
    overview:
      "Aquarius spreads across a wide patch of sky. Its most useful marker is a small Y-like Water Jar from which fainter chains seem to flow.",
    recognitionGuide:
      "Begin with Sadalsuud and Sadalmelik, then look for the compact Water Jar south of Pegasus.",
    brightestStar: "Sadalsuud",
    eveningPeak: "September–October",
    astronomyNote:
      "Aquarius is home to the Helix Nebula, one of the nearest bright planetary nebulae to Earth.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "sadalmelik", name: "Sadalmelik", designation: "α Aqr", x: 42, y: 26, magnitude: 3.0 },
      { id: "sadalsuud", name: "Sadalsuud", designation: "β Aqr", x: 69, y: 22, magnitude: 2.9, featured: true },
      { id: "sadachbia", name: "Sadachbia", designation: "γ Aqr", x: 51, y: 42, magnitude: 3.8 },
      { id: "albali", name: "Albali", designation: "ε Aqr", x: 33, y: 60, magnitude: 3.8 },
      { id: "ancha", name: "Ancha", designation: "θ Aqr", x: 49, y: 69, magnitude: 4.2 },
      { id: "skat", name: "Skat", designation: "δ Aqr", x: 72, y: 75, magnitude: 3.3 },
      { id: "situla", name: "Situla", designation: "κ Aqr", x: 86, y: 57, magnitude: 5.0 },
    ],
    edges: [["sadalmelik", "sadachbia"], ["sadalsuud", "sadachbia"], ["sadachbia", "albali"], ["sadachbia", "ancha"], ["ancha", "skat"], ["skat", "situla"]],
  },
  {
    id: "z12",
    slug: "pisces",
    orderAlongEcliptic: 12,
    name: "Pisces",
    vietnameseName: "Song Ngư",
    iauAbbreviation: "Psc",
    symbol: "♓",
    accent: "#a99bd8",
    meaning: "The Fishes",
    shortDescription: "Two faint loops are joined by a long celestial cord.",
    overview:
      "Pisces is wide and faint. Its two fish are easier to imagine as the Circlet in the west and a long cord meeting at Alrescha.",
    recognitionGuide:
      "Use the Great Square of Pegasus to locate the Circlet, then follow the faint cord toward Alrescha.",
    brightestStar: "Alpherg",
    eveningPeak: "October–November",
    astronomyNote:
      "The March equinox currently lies within Pisces, one result of the slow precession of Earth’s rotational axis.",
    isTraditionalZodiac: true,
    isCrossedByEcliptic: true,
    stars: [
      { id: "gamma", name: "Gamma Piscium", designation: "γ Psc", x: 17, y: 30, magnitude: 3.7 },
      { id: "alpherg", name: "Alpherg", designation: "η Psc", x: 30, y: 38, magnitude: 3.6, featured: true },
      { id: "torcular", name: "Torcular", designation: "ο Psc", x: 38, y: 58, magnitude: 4.3 },
      { id: "alrescha", name: "Alrescha", designation: "α Psc", x: 50, y: 75, magnitude: 3.8 },
      { id: "iota", name: "Iota Piscium", designation: "ι Psc", x: 72, y: 58, magnitude: 4.1 },
      { id: "omega", name: "Omega Piscium", designation: "ω Psc", x: 84, y: 43, magnitude: 4.0 },
      { id: "fumalsamakah", name: "Fumalsamakah", designation: "β Psc", x: 65, y: 27, magnitude: 4.5 },
    ],
    edges: [["gamma", "alpherg"], ["alpherg", "torcular"], ["torcular", "alrescha"], ["alrescha", "iota"], ["iota", "omega"], ["omega", "fumalsamakah"], ["fumalsamakah", "iota"]],
  },
  {
    id: "z13",
    slug: "ophiuchus",
    orderAlongEcliptic: 13,
    name: "Ophiuchus",
    vietnameseName: "Xà Phu",
    iauAbbreviation: "Oph",
    symbol: "⛎",
    accent: "#cf8bc2",
    meaning: "The Serpent Bearer",
    shortDescription: "A tall many-sided figure stands above Scorpius on the ecliptic.",
    overview:
      "Ophiuchus is crossed by the Sun’s apparent path even though it is not one of the twelve equal zodiac signs. Its broad outline represents a figure holding the two halves of Serpens.",
    recognitionGuide:
      "Look above Scorpius for a tall polygon rising to Rasalhague near the border with Hercules.",
    brightestStar: "Rasalhague",
    eveningPeak: "June–July",
    astronomyNote:
      "Ophiuchus contains Barnard’s Star, one of the nearest stars to the Sun, although it is far too faint to see without a telescope.",
    isTraditionalZodiac: false,
    isCrossedByEcliptic: true,
    stars: [
      { id: "rasalhague", name: "Rasalhague", designation: "α Oph", x: 50, y: 12, magnitude: 2.1, featured: true },
      { id: "cebalrai", name: "Cebalrai", designation: "β Oph", x: 70, y: 25, magnitude: 2.8 },
      { id: "yed-prior", name: "Yed Prior", designation: "δ Oph", x: 24, y: 42, magnitude: 2.7 },
      { id: "yed-posterior", name: "Yed Posterior", designation: "ε Oph", x: 34, y: 49, magnitude: 3.2 },
      { id: "sinistra", name: "Sinistra", designation: "ν Oph", x: 82, y: 49, magnitude: 3.3 },
      { id: "marfik", name: "Marfik", designation: "λ Oph", x: 70, y: 67, magnitude: 3.8 },
      { id: "sabik", name: "Sabik", designation: "η Oph", x: 42, y: 80, magnitude: 2.4 },
    ],
    edges: [["rasalhague", "cebalrai"], ["rasalhague", "yed-prior"], ["yed-prior", "yed-posterior"], ["yed-posterior", "sabik"], ["sabik", "marfik"], ["marfik", "sinistra"], ["sinistra", "cebalrai"]],
  },
];

export function getConstellation(slug: string) {
  return constellations.find((constellation) => constellation.slug === slug);
}

