
const fs = require('fs');
const text = fs.readFileSync('C:/Users/chean/OneDrive/Desktop/Antigravity/ProjectA/my-dashboard/src/data/memos/2022_sea-chan.txt', 'utf-8');
const lines = text.split(/\r?\n/);
lines.forEach((l1, i) => {
  if (i === lines.length-1) return;
  const l2 = lines[i+1];
  if (l1.length > 0 && l2.length > 0) {
     const lastChar = l1[l1.length-1];
     const firstChar = l2[0];
     // doesn't end with sentence punctuation
     if (!lastChar.match(/[.?!]/) && lastChar.match(/[a-zA-Z]/) && firstChar.match(/[a-zA-Z]/)) {
        if (l1.length <= 25 || l2.length <= 25) {
           console.log('Short line break: len ' + l1.length + ',' + l2.length + ' | ' + l1 + ' [+] ' + l2);
        }
     }
  }
});

