import os
import re
import glob

def clean_footer(text):
    lines = text.split('\n')
    out_lines = []
    for line in lines:
        if re.search(r'\d{4}\s+Oaktree Capital Management, L\.P\..*?All Rights Reserved', line):
            continue
        out_lines.append(line)
    return out_lines

def is_sentence_end(line):
    line = line.rstrip()
    if not line:
        return True
    
    # Check for sentence ending punctuation
    endings = ('.', '?', '!', '.”', '?”', '!”', '."', '?"', '!"', '.\'', '?\'', '!\'', '.)', '?)', '!)', ':', ';')
    if line.endswith(endings):
        return True
    return False

def format_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    lines = clean_footer(content)
    
    paragraphs = []
    current_para = []
    in_blockquote = False
    
    for i, line in enumerate(lines):
        # Clean up weird underline markers
        if line.startswith('U') and len(line) > 1 and line[1].isupper():
            line = line[1:]
            
        stripped = line.strip()
        
        # Check header
        header_match = re.match(r'^(Memo to|From|Re|Date):\s*(.*)', stripped, re.IGNORECASE)
        if header_match:
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
            paragraphs.append(f"**{header_match.group(1).title()}:** {header_match.group(2)}")
            continue
            
        # Check if line is a standalone date
        if re.match(r'^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}$', stripped):
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
            paragraphs.append(f"**Date:** {stripped}")
            continue

        if not stripped:
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
            # Double blank line might mean end of blockquote
            continue
            
        # Bullet points
        if stripped.startswith(('', '•', '-', '*')):
            if current_para:
                paragraphs.append(" ".join(current_para))
                current_para = []
            paragraphs.append(stripped)
            continue
            
        # If it's the start of a quote or clipping
        # Heuristic: if the previous paragraph ended with ':' and this isn't a list
        is_quote = False
        if paragraphs and paragraphs[-1].rstrip().endswith(':'):
            if not stripped.startswith(('', '•', '-', '*')):
                is_quote = True
                
        # Heuristic: starts with quotes and previous paragraph ended with : or ,
        if stripped.startswith(('"', '“', '. . .')):
            is_quote = True
            
        # Noah Sweat quote heuristic (doesn't start with quote, but context implies)
        if "If you mean whiskey," in stripped:
            is_quote = True
            
        if is_quote and not current_para:
            current_para.append("> " + stripped)
            in_blockquote = True
        elif in_blockquote and current_para:
            current_para.append(stripped)
        else:
            current_para.append(stripped)
            in_blockquote = False
            
        if is_sentence_end(line) or stripped.startswith(('', '•', '-', '*')):
            paragraphs.append(" ".join(current_para))
            current_para = []
            in_blockquote = False

    if current_para:
        paragraphs.append(" ".join(current_para))
        
    # Write to .md
    out_path = filepath.replace('.txt', '.md')
    with open(out_path, 'w', encoding='utf-8') as f:
        for p in paragraphs:
            f.write(p + '\n\n')

def main():
    memos_dir = r"C:\Users\chean\OneDrive\Desktop\Antigravity\ProjectA\my-dashboard\src\data\memos"
    for filepath in glob.glob(os.path.join(memos_dir, '*.txt')):
        print(f"Processing {filepath}")
        format_file(filepath)

if __name__ == '__main__':
    main()
