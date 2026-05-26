const YF = require('yahoo-finance2').default;
const yahooFinance = new YF();
yahooFinance.chart('^VIX', { period1: '2025-01-01', interval: '1mo' }).then(res => console.log('Yahoo:', res.quotes.slice(-3))).catch(console.error);
