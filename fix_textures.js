const fs = require('fs');
let data = fs.readFileSync('lib/data.ts', 'utf8');

data = data.replace(/texture_url: "(.*?)",/g, 'texture_url: "",');

fs.writeFileSync('lib/data.ts', data);
