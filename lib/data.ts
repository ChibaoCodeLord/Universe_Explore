export interface Planet {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  content: string;
  image_url: string;
  radius: string;
  mass: string;
  gravity: string;
  day: string;
  year: string;
  moons: number;
  temperature: string;
}

export const planets: Planet[] = [
  {
    id: "1",
    name: "Mercury",
    slug: "mercury",
    short_description: "The smallest planet in our solar system and closest to the Sun.",
    content: "Mercury is the smallest planet in the Solar System and the closest to the Sun. Its orbit around the Sun takes 87.97 Earth days, the shortest of all the Sun's planets. Mercury is a rocky planet with a solid, cratered surface, much like the Earth's moon.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg",
    radius: "2,439.7 km",
    mass: "3.3011 × 10²³ kg",
    gravity: "3.7 m/s²",
    day: "58.6 Earth days",
    year: "88 Earth days",
    moons: 0,
    temperature: "-173°C to 427°C",
  },
  {
    id: "2",
    name: "Venus",
    slug: "venus",
    short_description: "The second planet from the Sun, known for its thick, toxic atmosphere.",
    content: "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the brightest natural object in Earth's night sky after the Moon, Venus can cast shadows and can be, on rare occasions, visible to the naked eye in broad daylight.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg",
    radius: "6,051.8 km",
    mass: "4.8675 × 10²⁴ kg",
    gravity: "8.87 m/s²",
    day: "243 Earth days",
    year: "225 Earth days",
    moons: 0,
    temperature: "462°C",
  },
  {
    id: "3",
    name: "Earth",
    slug: "earth",
    short_description: "Our home planet, the only known place in the universe to harbor life.",
    content: "Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 29.2% of Earth's surface is land consisting of continents and islands. The remaining 70.8% is covered with water, mostly by oceans, seas, gulfs, and other salt-water bodies.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg",
    radius: "6,371 km",
    mass: "5.972 × 10²⁴ kg",
    gravity: "9.807 m/s²",
    day: "24 hours",
    year: "365.25 days",
    moons: 1,
    temperature: "-88°C to 58°C",
  },
  {
    id: "4",
    name: "Mars",
    slug: "mars",
    short_description: "The Red Planet, a dusty, cold, desert world with a very thin atmosphere.",
    content: "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System, being larger than only Mercury. In English, Mars carries the name of the Roman god of war and is often referred to as the 'Red Planet'.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
    radius: "3,389.5 km",
    mass: "6.4171 × 10²³ kg",
    gravity: "3.71 m/s²",
    day: "24.6 hours",
    year: "687 Earth days",
    moons: 2,
    temperature: "-153°C to 20°C",
  },
  {
    id: "5",
    name: "Jupiter",
    slug: "jupiter",
    short_description: "The largest planet in our solar system, a gas giant with a Great Red Spot.",
    content: "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets in the Solar System combined, but slightly less than one-thousandth the mass of the Sun.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
    radius: "69,911 km",
    mass: "1.898 × 10²⁷ kg",
    gravity: "24.79 m/s²",
    day: "9.9 hours",
    year: "11.86 Earth years",
    moons: 95,
    temperature: "-110°C",
  },
  {
    id: "6",
    name: "Saturn",
    slug: "saturn",
    short_description: "The sixth planet, recognized for its extensive and beautiful ring system.",
    content: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius of about nine and a half times that of Earth. It only has one-eighth the average density of Earth; however, with its larger volume, Saturn is over 95 times more massive.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
    radius: "58,232 km",
    mass: "5.683 × 10²⁶ kg",
    gravity: "10.44 m/s²",
    day: "10.7 hours",
    year: "29.45 Earth years",
    moons: 146,
    temperature: "-140°C",
  },
  {
    id: "7",
    name: "Uranus",
    slug: "uranus",
    short_description: "An ice giant that rotates on its side, making it unique in the solar system.",
    content: "Uranus is the seventh planet from the Sun. Its name is a reference to the Greek god of the sky, Uranus. It has the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg",
    radius: "25,362 km",
    mass: "8.681 × 10²⁵ kg",
    gravity: "8.69 m/s²",
    day: "17.2 hours",
    year: "84 Earth years",
    moons: 27,
    temperature: "-195°C",
  },
  {
    id: "8",
    name: "Neptune",
    slug: "neptune",
    short_description: "The eighth and farthest known planet from the Sun, a dark and cold ice giant.",
    content: "Neptune is the eighth and farthest-known Solar planet from the Sun. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet.",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg",
    radius: "24,622 km",
    mass: "1.024 × 10²⁶ kg",
    gravity: "11.15 m/s²",
    day: "16.1 hours",
    year: "164.8 Earth years",
    moons: 14,
    temperature: "-200°C",
  }
];
