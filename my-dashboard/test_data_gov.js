async function testDataGov() {
  try {
    const res = await fetch("https://data.gov.tw/dataset/4523");
    const html = await res.text();
    // Search for href containing '.csv' or '.json' or 'Download.ashx'
    const matches = html.match(/href="([^"]*)"/g);
    const links = matches.map(m => m.replace(/href="|"/g, ''));
    const zipLinks = links.filter(l => l.includes('.zip') || l.includes('zip'));
    console.log("ZIP links:", zipLinks);
    
    // Check if there is an API button or link
    const apiLinks = links.filter(l => l.includes('api') && l.includes('ndc'));
    console.log("API links:", apiLinks);
    
  } catch(e) { console.error(e); }
}
testDataGov();
