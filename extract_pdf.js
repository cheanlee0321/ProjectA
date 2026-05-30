const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = 'C:/Users/chean/OneDrive/Desktop/the-complete-collection.pdf';
const txtPath = 'C:/Users/chean/OneDrive/Desktop/the-complete-collection.txt';

console.log('Reading PDF from: ' + pdfPath);
try {
    let dataBuffer = fs.readFileSync(pdfPath);
    console.log('PDF read successfully, starting extraction...');

    pdf(dataBuffer).then(function(data) {
        console.log('Number of pages: ' + data.numpages);
        fs.writeFileSync(txtPath, data.text, 'utf8');
        console.log('Extraction complete! Text saved to ' + txtPath);
    }).catch(function(error) {
        console.error('Error parsing PDF:', error);
    });
} catch (error) {
    console.error('Error reading file:', error);
}
