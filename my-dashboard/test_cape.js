async function check() {
  try {
    const res = await fetch('https://www.multpl.com/shiller-pe', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    const match = html.match(/Shiller P\/E is ([0-9.]+)/) || html.match(/<meta name="description" content="[^0-9]*([0-9.]+)/) || html.match(/([0-9]{2}\.[0-9]{2})/);
    console.log(match ? match[1] : 'No match');
    
    // Also save html to check
    require('fs').writeFileSync('multpl.html', html);
  } catch (e) {
    console.error(e);
  }
}
check();
