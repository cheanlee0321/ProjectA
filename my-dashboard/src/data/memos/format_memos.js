const fs = require('fs');
const path = require('path');

const memoDir = 'C:\\Users\\chean\\OneDrive\\Desktop\\Antigravity\\ProjectA\\my-dashboard\\src\\data\\memos';
const files = [
    '2004_hedge-funds-a-case-for-caution.txt', '2004_oaktree-at-ten.txt', '2004_risk-and-return-toda.txt',
    '2004_the-happy.txt', '2004_us-and-them.txt', '2005_a-case-in-point.txt',
    '2005_hindsight-first-please-or-what-were-they-thinking.txt', '2005_risk.txt',
    '2005_there-they-go-again.txt', '2006_dare-to-be-great.txt', '2006_it-is-wh.txt',
    '2006_pigweed.txt', '2006_the-new-paradigm.txt', '2006_the-race-to-the-bottom.txt',
    '2006_you-can-t-eat-irr.txt', '2007_everyone-knows.txt', '2007_it.txt',
    '2007_no-different-this-time-the-lessons-of-07.txt', '2007_now-it-s-all-bad.txt',
    '2007_now-what.txt'
];

for (const filename of files) {
    const filepath = path.join(memoDir, filename);
    if (!fs.existsSync(filepath)) {
        console.log(`Missing ${filename}`);
        continue;
    }

    const content = fs.readFileSync(filepath, 'utf-8');
    const lines = content.split(/\r?\n/);

    const cleanedLines = [];
    for (const line of lines) {
        if (/\d{4}\s*Oaktree Capital Management.*?All Rights Reserved/i.test(line)) {
            continue;
        }
        cleanedLines.push(line.trim());
    }

    while (cleanedLines.length > 0 && cleanedLines[0] === '') {
        cleanedLines.shift();
    }

    const fixedLines = [];
    let i = 0;
    while (i < cleanedLines.length) {
        const line = cleanedLines[i];
        if (line.toLowerCase() === 'from' && i + 1 < cleanedLines.length && cleanedLines[i+1].startsWith(':')) {
            fixedLines.push(line + cleanedLines[i+1]);
            i += 2;
        } else if (line.toLowerCase() === 'memo to' && i + 1 < cleanedLines.length && cleanedLines[i+1].startsWith(':')) {
            fixedLines.push(line + cleanedLines[i+1]);
            i += 2;
        } else {
            fixedLines.push(line);
            i += 1;
        }
    }

    const paragraphs = [];
    let currentPara = '';

    for (const line of fixedLines) {
        if (!line) {
            if (currentPara) {
                paragraphs.push(currentPara);
                currentPara = '';
            }
            continue;
        }

        const headerMatch = line.match(/^(Memo to|From|Re|Date)\s*:(.*)/i);
        if (headerMatch) {
            if (currentPara) {
                paragraphs.push(currentPara);
                currentPara = '';
            }
            // Need to handle cases where there are spaces between the words in the header
            paragraphs.push(`**${line}**`);
            continue;
        }

        if (!currentPara) {
            currentPara = line;
        } else {
            if (/[.?!][”"'’]?$/.test(currentPara) || line.startsWith('') || line.startsWith('o ')) {
                paragraphs.push(currentPara);
                currentPara = line;
            } else {
                if (currentPara.endsWith('-')) {
                    currentPara = currentPara.slice(0, -1) + line;
                } else {
                    currentPara += ' ' + line;
                }
            }
        }
    }

    if (currentPara) {
        paragraphs.push(currentPara);
    }

    const finalParagraphs = [];
    for (let p of paragraphs) {
        if (p.startsWith('"') || p.startsWith('“')) {
            p = '> ' + p;
        }
        
        // Remove those U prefix artifact before uppercase letters that look like headings
        // Actually, this might accidentally strip words like USA, so let's be careful.
        if (/^U[A-Z]/.test(p) && p.length < 100 && !p.includes(' ')) {
            // maybe keep as is, but we can't be sure
        }
        
        finalParagraphs.push(p);
    }

    const outFilepath = path.join(memoDir, filename.replace('.txt', '.md'));
    fs.writeFileSync(outFilepath, finalParagraphs.join('\n\n'), 'utf-8');
    
    console.log(`Processed ${filename}`);
}
