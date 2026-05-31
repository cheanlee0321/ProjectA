
const fs = require('fs');
const text = fs.readFileSync('C:/Users/chean/OneDrive/Desktop/Antigravity/ProjectA/my-dashboard/src/data/memos/2022_sea-chan.txt', 'utf-8');
const lines = text.split(/\r?\n/);
lines.forEach((l1, i) => {
  if (i === lines.length-1) return;
  const l2 = lines[i+1];
  if (l1.length > 0 && l2.length > 0 && l1[l1.length-1].match(/[a-zA-Z]/) && l2[0].match(/[a-zA-Z]/)) {
     console.log('Line ' + (i+1) + ': len ' + l1.length + ' | ' + l1.slice(-10) + ' + ' + l2.slice(0, 10));
  }
});

