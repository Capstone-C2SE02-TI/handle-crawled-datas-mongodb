const {
    log,
    TWO_MINUTES_SECONDS,
    TEN_MINUTES_SECONDS
} = require("../constants");
const {
    saveCategoriesToFile,
    saveCategoriesToDB
} = require("../functions/tags");
const {
    handleTokensPrices,
    saveCoinsToFile,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
    getValueFromPromise,
    getOriginalPriceOfToken,
    getDateNearTransaction,
    getPriceWithDaily,
    handleInvestorTransactionHistory,
    getCoinOrTokenDetails
} = require("../functions/coins");
const {
    getListCryptosOfShark,
    calculateInvestorPercent24h,
    handleFormatTradeTransactionDataCrawl,
    handleFormatTradeTransactionDataMain,
    handleTradeTransaction,
    updateInvestorTradeTransaction,
    updateInvestorHistoryDatasTest,
    saveInvestorsToFile,
    convertInvestorsCollection,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorsToDB,
    saveConvertedInvestorCollectionToDB,
    calculateTotalValueInOut,
    updateInvestorTransactionsHistoryTotalValueFirstTrans,
    getFollowersOldDatas
} = require("../functions/investors");
const {
    _saveConvertedTransactionsToDB,
    handleEachTransaction,
    convertTransactions,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    handleDetailChartTransaction
} = require("../functions/transactions");
let id1 = 0,
    id2 = 0,
    id3 = 0,
    id4 = 0,
    id5 = 0,
    id6 = 0,
    id7 = 0,
    id8 = 0;

/* Run every 10 minutes: Update collection datas */
// tags
// setInterval(async () => {
//     log("Run tags ...");
//     console.time(`Execute_time tags ${++id1}`);
//     await saveCategoriesToFile();
//     await dropDBMainCollection("tags");
//     console.time(`Execute_time tags-save-db ${++id2}`);
//     await saveCategoriesToDB();
//     console.timeEnd(`Execute_time tags-save-db ${id2}`);
//     console.timeEnd(`Execute_time tags ${id1}`);
// }, TEN_MINUTES_SECONDS);

// coins
// setInterval(async () => {
//     log("Run coins ...");
//     console.time(`Execute_time coins ${++id3}`);
//     await saveCoinsToFile();
//     await saveConvertedCoinCollectionToFile();
//     console.time(`Execute_time coins-save-db ${++id4}`);
//     saveConvertedCoinCollectionToDB(id4);
//     console.timeEnd(`Execute_time coins ${id3}`);
// }, TWO_MINUTES_SECONDS);

// investors
// setInterval(async () => {
//     log("Run investors ...");
//     console.time(`Execute_time investors ${++id5}`);
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     console.time(`Execute_time investors-save-db ${++id6}`);
//     await saveConvertedInvestorCollectionToDB();
//     console.timeEnd(`Execute_time investors-save-db ${id6}`);
//     console.timeEnd(`Execute_time investors ${id5}`);
// }, TEN_MINUTES_SECONDS);

// transactions
// setInterval(async () => {
//     log("Run transactions ...");
//     console.time(`Execute_time transactions ${++id7}`);
//     await dropDBMainCollection("transactions");
//     console.time(`Execute_time transactions-save-db ${++id8}`);
//     await _saveConvertedTransactionsToDB();
//     console.timeEnd(`Execute_time transactions-save-db ${id8}`);
//     console.timeEnd(`Execute_time transactions ${id7}`);
// }, TEN_MINUTES_SECONDS);

// Testing ...
setTimeout(async () => {
    console.time(`Execute_time 1`);
    // await saveConvertedInvestorCollectionToFile(id5);
    console.timeEnd(`Execute_time 1`);
}, 0);
