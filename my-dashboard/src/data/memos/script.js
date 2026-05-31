
const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    console.log('Words loaded: ' + data.length);
    fs.writeFileSync('words.txt', data);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});

