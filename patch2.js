const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace(/\.focus-trigger-wrapper \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/\.focus-toggle-btn \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/\.focus-toggle-btn:hover \{[\s\S]*?\}\n\n/g, '');
content = content.replace(/\.focus-timer-mini \{[\s\S]*?\}\n\n/g, '');
fs.writeFileSync('src/index.css', content);
