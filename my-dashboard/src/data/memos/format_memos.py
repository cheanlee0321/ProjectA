import os, re

memo_dir = r'C:\Users\chean\OneDrive\Desktop\Antigravity\ProjectA\my-dashboard\src\data\memos'
files = [
    '2004_hedge-funds-a-case-for-caution.txt', '2004_oaktree-at-ten.txt', '2004_risk-and-return-toda.txt',
    '2004_the-happy.txt', '2004_us-and-them.txt', '2005_a-case-in-point.txt',
    '2005_hindsight-first-please-or-what-were-they-thinking.txt', '2005_risk.txt',
    '2005_there-they-go-again.txt', '2006_dare-to-be-great.txt', '2006_it-is-wh.txt',
    '2006_pigweed.txt', '2006_the-new-paradigm.txt', '2006_the-race-to-the-bottom.txt',
    '2006_you-can-t-eat-irr.txt', '2007_everyone-knows.txt', '2007_it.txt',
    '2007_no-different-this-time-the-lessons-of-07.txt', '2007_now-it-s-all-bad.txt',
    '2007_now-what.txt'
]

for filename in files:
    filepath = os.path.join(memo_dir, filename)
    if not os.path.exists(filepath):
        print(f'Missing {filename}')
        continue
    
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.read().splitlines()

    new_lines = []
    # 1. Remove footers
    cleaned_lines = []
    for line in lines:
        if re.search(r'\d{4}\s*Oaktree Capital Management.*?All Rights Reserved', line, re.IGNORECASE):
            continue
        cleaned_lines.append(line.strip())

    # filter out empty lines at the start
    while cleaned_lines and not cleaned_lines[0]:
        cleaned_lines.pop(0)

    # Pre-process for broken headers like:
    # Memo            to:            Oaktree            Clients            
    # From:    Howard  Marks  
    # Wait, the above is two lines but valid! Let's check for "From \n :"
    fixed_lines = []
    i = 0
    while i < len(cleaned_lines):
        line = cleaned_lines[i]
        if line.lower() == 'from' and i + 1 < len(cleaned_lines) and cleaned_lines[i+1].startswith(':'):
            fixed_lines.append(line + cleaned_lines[i+1])
            i += 2
        elif line.lower() == 'memo to' and i + 1 < len(cleaned_lines) and cleaned_lines[i+1].startswith(':'):
            fixed_lines.append(line + cleaned_lines[i+1])
            i += 2
        else:
            fixed_lines.append(line)
            i += 1
            
    # 2. Reconstruct paragraphs
    paragraphs = []
    current_para = ''
    
    for line in fixed_lines:
        if not line:
            if current_para:
                paragraphs.append(current_para)
                current_para = ''
            continue

        # Header detection
        header_match = re.match(r'^(Memo to|From|Re|Date)\s*:(.*)', line, re.IGNORECASE)
        if header_match:
            if current_para:
                paragraphs.append(current_para)
                current_para = ''
            paragraphs.append(f'**{line}**')
            continue

        if not current_para:
            current_para = line
        else:
            # Does current_para end in sentence-ending punctuation?
            # Also considering lists, which start with bullet characters.
            if re.search(r'[.?!][”\"\'’]?$', current_para) or line.startswith('') or line.startswith('o '):
                # Ends paragraph!
                paragraphs.append(current_para)
                current_para = line
            else:
                # Part of same paragraph
                if current_para.endswith('-'):
                    current_para = current_para[:-1] + line
                else:
                    current_para += ' ' + line

    if current_para:
        paragraphs.append(current_para)

    # 3. Identify blockquotes
    final_paragraphs = []
    for i, p in enumerate(paragraphs):
        # A simple heuristic: if a paragraph starts with a quotation mark.
        if p.startswith('\"') or p.startswith('“'):
            p = '> ' + p
        
        # Another heuristic: if previous paragraph ended with colon and this is short or indented.
        # But we don't have indentation info since we stripped.
        # Let's just stick to quotes and bullet points format nicely.
        
        final_paragraphs.append(p)

    # Write to .md
    out_filepath = os.path.join(memo_dir, filename.replace('.txt', '.md'))
    with open(out_filepath, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(final_paragraphs))
        
    print(f'Processed {filename}')
