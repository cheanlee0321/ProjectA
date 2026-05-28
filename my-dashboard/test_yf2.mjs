import yahooFinance from 'yahoo-finance2';

async function run() {
    try {
        const yf = typeof yahooFinance === 'function' ? new (yahooFinance as any)() : yahooFinance;
        console.log("Success with new()");
    } catch(e) {
        console.log(e);
    }
}
run();
