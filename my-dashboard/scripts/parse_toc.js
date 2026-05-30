const fs = require('fs');
const path = require('path');

const inputPath = 'C:/Users/chean/OneDrive/Desktop/the-complete-collection.txt';
const outputPath = path.join(__dirname, '../src/data/howard_marks_toc.json');

const text = fs.readFileSync(inputPath, 'utf8');
const lines = text.split('\n');

const memos = [];
let currentYear = 'Unknown';
const yearRegex = /\b(199\d|200\d|201\d|202\d)\b/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  if (line.startsWith('Re:')) {
    let title = line.substring(3).trim();
    
    // clean up title
    // Replacing weird characters from PDF extraction
    title = title.replace(/[]/g, '').trim(); 
    if (title.length < 2) continue;
    
    // search upwards up to 50 lines to find a year
    let year = currentYear;
    for (let j = i; j >= Math.max(0, i - 50); j--) {
       const match = lines[j].match(yearRegex);
       if (match) {
           year = match[1];
           break;
       }
    }
    if (year !== 'Unknown') {
        currentYear = year;
    }
    
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    memos.push({ year: currentYear, title, id });
  }
}

// Group by year
const grouped = memos.reduce((acc, curr) => {
  if (!acc[curr.year]) {
    acc[curr.year] = [];
  }
  // Check for duplicates
  if (!acc[curr.year].find(m => m.title === curr.title)) {
      acc[curr.year].push(curr);
  }
  return acc;
}, {});

const result = Object.keys(grouped).sort().map(year => ({
  year,
  memos: grouped[year]
}));

// remove years that are less than 1990
const finalResult = result.filter(r => parseInt(r.year) >= 1990);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(finalResult, null, 2), 'utf8');

console.log('TOC parsed successfully! Saved to ' + outputPath);
console.log('Total years:', finalResult.length);
