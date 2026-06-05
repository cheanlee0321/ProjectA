import re
with open('src/app/strategy/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    cls = match.group(1)
    cls = re.sub(r'\s*(mb-8|mb-10|mb-12|mt-8)\s*', ' ', cls).strip()
    cls = 'mb-12 ' + cls
    return '<div className="' + cls + '">'

new_content = re.sub(r'<div className="([^"]*rounded-3xl bg-[a-z]+-500/10[^"]*)">', replacer, content)

with open('src/app/strategy/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
print('Done!')
