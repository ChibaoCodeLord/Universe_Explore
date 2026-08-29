import fs from "node:fs";
let data = fs.readFileSync('lib/data.ts', 'utf8');

const additions = {
  mercury: { color: "#8c8c8c", texture: "https://upload.wikimedia.org/wikipedia/commons/9/92/Mercury_in_true_color_%28equirectangular%29.png" },
  venus: { color: "#e3bb76", texture: "" },
  earth: { color: "#2b82c9", texture: "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg" },
  mars: { color: "#c1440e", texture: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg" },
  jupiter: { color: "#d39c7e", texture: "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg" },
  saturn: { color: "#ead6b8", texture: "" },
  uranus: { color: "#4b70dd", texture: "" },
  neptune: { color: "#274687", texture: "" }
};

data = data.replace(/temperature: (.*?),/g, (match) => {
  return match + "\n    color: \"#ffffff\",\n    texture_url: \"\",";
});

data = data.replace(/export interface Planet \{([\s\S]*?)\}/, (match, p1) => {
  return "export interface Planet {" + p1 + "  color: string;\n  texture_url: string;\n}";
});

Object.keys(additions).forEach(slug => {
  const regex = new RegExp(`slug: "${slug}",([\\s\\S]*?)color: "#ffffff",([\\s\\S]*?)texture_url: "",`);
  data = data.replace(regex, `slug: "${slug}",$1color: "${additions[slug].color}",$2texture_url: "${additions[slug].texture}",`);
});

fs.writeFileSync('lib/data.ts', data);
