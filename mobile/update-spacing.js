const fs = require('fs');
const path = require('path');

const patterns = [
  { from: /Spacing\['2xl'\]/g, to: 'Spacing.xxl' },
  { from: /Spacing\['3xl'\]/g, to: 'Spacing.xxxl' },
  { from: /Spacing\['4xl'\]/g, to: 'Spacing.xxxxl' },
  { from: /Spacing\['5xl'\]/g, to: 'Spacing.xxxxxl' },
  { from: /Spacing\.2xl/g, to: 'Spacing.xxl' },
  { from: /Spacing\.3xl/g, to: 'Spacing.xxxl' },
  { from: /Spacing\.4xl/g, to: 'Spacing.xxxxl' },
  { from: /Spacing\.5xl/g, to: 'Spacing.xxxxxl' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if ((fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) && !fullPath.includes('theme.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      for (const { from, to } of patterns) {
        if (from.test(content)) {
          content = content.replace(from, to);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated spacing in ${fullPath}`);
      }
    }
  }
}

processDir('./src');
processDir('./app');
