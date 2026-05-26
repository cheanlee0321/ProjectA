async function testNDC() {
  try {
    // try different endpoint ids if 10 doesn't work
    const res = await fetch('https://index.ndc.gov.tw/n/json/data/10');
    if (!res.ok) {
      console.log('Failed:', res.status);
      
      const res2 = await fetch('https://index.ndc.gov.tw/n/json/data/1');
      const data2 = await res2.json();
      console.log('Endpoint 1:', data2);
      return;
    }
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
testNDC();
