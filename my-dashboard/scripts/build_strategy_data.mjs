import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import https from 'https';
import http from 'http';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Helper to fetch CSV
function fetchCSV(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => {
            obj[h] = values[i];
        });
        return obj;
    });
}

(async () => {
    const dataDir = 'C:\\Users\\chean\\OneDrive\\Desktop\\Antigravity\\ProjectA\\Data';
    const outputDir = 'C:\\Users\\chean\\OneDrive\\Desktop\\Antigravity\\ProjectA\\my-dashboard\\public\\data';

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Fetch MBCURRCIR instead of M0
    console.log("Fetching MBCURRCIR data from FRED...");
    const currcirContent = await fetchCSV('https://fred.stlouisfed.org/graph/fredgraph.csv?id=MBCURRCIR');
    const currcirData = parseCSV(currcirContent);
    const m0Map = {};
    for (const row of currcirData) {
        if (!row.observation_date) continue;
        const yyyy_mm = row.observation_date.substring(0, 7);
        m0Map[yyyy_mm] = parseFloat(row.MBCURRCIR); // Value in Billions
    }

    // 2. Read FINRA
    const wb = xlsx.readFile(path.join(dataDir, 'FINRA-margin-statistics.xlsx'));
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const finraData = xlsx.utils.sheet_to_json(sheet);
    const finraMap = {};
    for (const row of finraData) {
        const yyyy_mm = row['Year-Month'];
        const margin = row["Debit Balances in Customers' Securities Margin Accounts"];
        if (yyyy_mm && margin !== undefined) {
            finraMap[yyyy_mm] = parseFloat(margin); // Value in Millions
        }
    }

    // 3. Read Stock Data from Yahoo Finance
    async function fetchStock(symbol) {
        console.log("Fetching " + symbol + "...");
        const result = await yahooFinance.chart(symbol, { period1: '1990-01-01', interval: '1mo' });
        const monthMap = {};
        for (const q of result.quotes) {
            if (!q.close) continue;
            const d = q.date;
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            monthMap[`${yyyy}-${mm}`] = q.close;
        }
        return monthMap;
    }

    const sp500Map = await fetchStock('SPY');
    const qqqMap = await fetchStock('QQQ');
    const tqqqMap = await fetchStock('TQQQ');

    // 4. Read CAPE Data from multpl.com
    console.log("Fetching CAPE from multpl.com...");
    const capeMap = {};
    try {
        const req = await fetch('https://www.multpl.com/shiller-pe/table/by-month');
        const html = await req.text();
        const regex = /<td>(.*?)<\/td>\s*<td>\s*&#x2002;\s*([\d.]+)\s*<\/td>/gs;
        let match;
        while ((match = regex.exec(html)) !== null) {
            const dateStr = match[1].trim();
            const valStr = match[2].trim();
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
                const yyyy = d.getFullYear();
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const month = `${yyyy}-${mm}`;
                if (!capeMap[month]) {
                    capeMap[month] = parseFloat(valStr);
                }
            }
        }
    } catch (e) {
        console.error("Failed to fetch/parse CAPE data from multpl", e);
    }

    // 5. Combine
    const allMonths = new Set([
        ...Object.keys(m0Map),
        ...Object.keys(finraMap),
        ...Object.keys(sp500Map),
        ...Object.keys(qqqMap),
        ...Object.keys(tqqqMap),
        ...Object.keys(capeMap)
    ]);

    const combined = [];
    for (const month of Array.from(allMonths).sort()) {
        const currency = m0Map[month]; // in Billions
        if (!currency) continue;

        const obj = { month };
        
        const finra = finraMap[month];
        if (finra !== undefined) {
            obj.finraToM0 = finra / (currency * 1000);
        }

        const sp500 = sp500Map[month];
        if (sp500 !== undefined) obj.sp500ToM0 = sp500 / currency;

        const qqq = qqqMap[month];
        if (qqq !== undefined) obj.qqqToM0 = qqq / currency;

        const tqqq = tqqqMap[month];
        if (tqqq !== undefined) obj.tqqqToM0 = tqqq / currency;

        const cape = capeMap[month];
        if (cape !== undefined) obj.cape = cape;

        if (obj.finraToM0 || obj.sp500ToM0 || obj.qqqToM0 || obj.tqqqToM0 || obj.cape) {
            combined.push(obj);
        }
    }

    fs.writeFileSync(path.join(outputDir, 'strategy_data.json'), JSON.stringify(combined, null, 2));
    console.log('Successfully wrote strategy_data.json. Total records:', combined.length);
})();
