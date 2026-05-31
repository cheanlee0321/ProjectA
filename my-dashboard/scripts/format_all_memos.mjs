import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memosDir = path.join(__dirname, '..', 'src', 'data', 'memos');

function formatMemo(content) {
  // Remove Oaktree copyright footers
  let text = content.replace(/[0-9]{4}\s+Oaktree Capital Management, L\.P\..*?All Rights Reserved/gi, '');
  
  // Split by line
  const lines = text.split(/\r?\n/);
  const processedLines = [];
  let currentParagraph = '';
  
  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (currentParagraph) {
        processedLines.push(currentParagraph);
        currentParagraph = '';
      }
      continue;
    }

    // Format headers if we are in the first few lines
    if (inHeader) {
      if (line.match(/^(Memo to|From|Re|Date):/i)) {
        processedLines.push(`**${line.replace(/:/, ':**')}`);
        continue;
      }
      // If we see something that doesn't look like a header, we leave header mode
      if (processedLines.length > 0 && !line.match(/^(Memo to|From|Re|Date|Trust Company)/i)) {
        inHeader = false;
        processedLines.push('---');
      }
    }

    if (currentParagraph) {
      const lastChar = currentParagraph.slice(-1);
      // Join broken words
      if (lastChar === '-') {
        currentParagraph = currentParagraph.slice(0, -1) + line;
      } else {
        // If the current paragraph doesn't end with a sentence-ending punctuation, join without newline
        if (!['.', '?', '!', ':', '"', '”'].includes(lastChar)) {
          // If the last word is like "sw" and line is "ings", they are part of a word.
          // But it's hard to tell without dictionary. We'll just add a space.
          // PDF word breaks sometimes don't have hyphens. We'll join with a space and fix common double spaces.
          currentParagraph += ' ' + line;
        } else {
          currentParagraph += ' ' + line;
        }
      }
    } else {
      currentParagraph = line;
    }
  }

  if (currentParagraph) {
    processedLines.push(currentParagraph);
  }

  // Final cleanup
  return processedLines.join('\n\n')
    .replace(/\s{2,}/g, ' ') // Remove multiple spaces
    .replace(/sw ings/g, 'swings') // Hardcoded fix for known split
    .replace(/dependa ble/g, 'dependable');
}

async function processMemos() {
  const files = fs.readdirSync(memosDir).filter(f => f.endsWith('.txt'));
  console.log(`Found ${files.length} txt files. Processing...`);

  for (const file of files) {
    if (file === '1990_first-quarter-performance.txt') continue; // Skip the one we did manually
    
    const txtPath = path.join(memosDir, file);
    const mdPath = path.join(memosDir, file.replace('.txt', '.md'));
    
    const content = fs.readFileSync(txtPath, 'utf-8');
    const formattedContent = formatMemo(content);
    
    fs.writeFileSync(mdPath, formattedContent);
  }

  console.log('Finished formatting all memos into Markdown!');
}

processMemos();
