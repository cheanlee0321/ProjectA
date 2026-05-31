const fs = require('fs');
const path = require('path');

const memosDir = path.join('C:', 'Users', 'chean', 'OneDrive', 'Desktop', 'Antigravity', 'ProjectA', 'my-dashboard', 'src', 'data', 'memos');
const files = fs.readdirSync(memosDir).filter(f => f.endsWith('.txt'));

for (let file of files) {
    let filePath = path.join(memosDir, file);
    let text = fs.readFileSync(filePath, 'utf8');
    
    // Remove footers
    text = text.replace(/^[ \t]*©?[ \t]*\d{4}[ \t]+Oaktree[ \t]+Capital[ \t]+Management.*?All Rights Reserved[ \t]*$/gmi, '');
    
    let lines = text.split('\n');
    let paragraphs = [];
    let currentParagraph = "";
    
    const headerRegex = /^(Memo to|From|Re|Date):\s*(.*)/i;
    const isBullet = (str) => /^[•\-\*]\s/.test(str);
    const endsWithPunctuation = (str) => /[.?!:;"'”’]\s*$/.test(str);
    
    for (let i = 0; i < lines.length; i++) {
        let rawLine = lines[i];
        let trimmed = rawLine.trim();
        
        if (trimmed === "") {
            if (currentParagraph) {
                paragraphs.push(currentParagraph);
                currentParagraph = "";
            }
        } else {
            let headerMatch = trimmed.match(headerRegex);
            if (headerMatch) {
                if (currentParagraph) {
                    paragraphs.push(currentParagraph);
                    currentParagraph = "";
                }
                paragraphs.push(`**${headerMatch[1]}:** ${headerMatch[2]}`);
                continue;
            }
            
            if (!currentParagraph) {
                currentParagraph = trimmed;
            } else {
                if (isBullet(trimmed)) {
                    paragraphs.push(currentParagraph);
                    currentParagraph = trimmed;
                } else if (endsWithPunctuation(currentParagraph)) {
                    paragraphs.push(currentParagraph);
                    currentParagraph = trimmed;
                } else {
                    currentParagraph += " " + trimmed;
                }
            }
        }
    }
    if (currentParagraph) {
        paragraphs.push(currentParagraph);
    }
    
    // Heuristic for blockquotes
    let insideQuote = false;
    let quoteTrigger = /(:|follows|wrote|saying|stated|article|says|quotes)\s*$/i;
    
    let markdownLines = [];
    for (let i = 0; i < paragraphs.length; i++) {
        let p = paragraphs[i];
        
        if (p.startsWith('**') || isBullet(p)) {
            markdownLines.push(p);
            insideQuote = false;
            continue;
        }
        
        // If it starts with quote marks, it's definitely a quote
        if (/^["“]/.test(p) && !/^["“][^"”]+["”]$/.test(p)) {
            insideQuote = true;
        }
        
        // If the previous paragraph ended with a quote trigger, start quoting
        if (i > 0 && quoteTrigger.test(paragraphs[i-1])) {
            insideQuote = true;
        }
        
        // Exiting a quote
        if (insideQuote && (p.startsWith("I ") || p.startsWith("My ") || p.startsWith("Thus") || p.startsWith("In other words") || p.startsWith("So ") || p.startsWith("But "))) {
            insideQuote = false;
        }
        
        if (insideQuote) {
            markdownLines.push("> " + p);
            if (p.endsWith('"') || p.endsWith('”') || p.match(/["”]\s*$/)) {
                insideQuote = false;
            }
        } else {
            markdownLines.push(p);
        }
    }
    
    let markdown = markdownLines.join('\n\n');
    let mdPath = filePath.replace('.txt', '.md');
    fs.writeFileSync(mdPath, markdown, 'utf8');
}
console.log("Processed " + files.length + " files.");
