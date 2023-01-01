const cron = require("node-cron");
const { fs, log } = require("./constants");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlCategoryModel,
    DBMainAdminModel,
    DBMainTagModel,
    DBMainCoinModel,
    DBMainTransactionModel,
    DBMainUserModel,
    DBMainInvestorModel
} = require("./models");
const {
    dropDBMainCollection,
    handleTokensPrices,
    handleFormatTradeTransactionDataCrawl,
    handleFormatTradeTransactionDataMain,
    handleTradeTransaction,
    updateInvestorTradeTransaction,
    updateInvestorHistoryDatasTest,
    saveInvestorsToFile,
    saveCoinsToFile,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
    getListCryptosOfShark,
    convertInvestorsCollection,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorCollectionToDB,
    calculateTotalValueInOut,
    saveCategoriesToFile,
    saveCategoriesToDB,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    updateInvestorTransactionsHistoryTotalValueFirstTrans,
    calculateInvestorPercent24h,
    handleDetailChartTransaction,
    renameTransactionCollectionField,
    removeFieldInMultipleCollection
} = require("./features/write");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");
let id1 = 0,
    id2 = 0,
    id3 = 0,
    id4 = 0,
    id5 = 0,
    id6 = 0,
    id7 = 0,
    id8 = 0,
    id9 = 0,
    id10 = 0;

/* 1. Run every 10 minutes: Update collection datas */
// tags
// setTimeout(async () => {
//     log("Run tags ...");
//     console.time(`Execute time tags ${++id1}`);
//     await saveCategoriesToFile();
//     await dropDBMainCollection("tags");
//     console.time(`Execute time tags-save-db ${++id2}`);
//     await saveCategoriesToDB();
//     console.timeEnd(`Execute time tags-save-db ${id2}`);
//     console.timeEnd(`Execute time tags ${id1}`);
// }, 0);

// coins: 2 phút (120000), 10 phút (600000)
setInterval(async () => {
    log("Run coins ...");
    console.time(`Execute time coins ${++id3}`);
    await saveCoinsToFile();
    await saveConvertedCoinCollectionToFile();
    console.time(`Execute time coins-save-db ${++id4}`);
    saveConvertedCoinCollectionToDB(id4);
    console.timeEnd(`Execute time coins ${id3}`);
}, 120000);

// investors
// setTimeout(async () => {
//     log("Run investors ...");
//     console.time(`Execute time investors ${++id5}`);
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     console.time(`Execute time investors-save-db ${++id6}`);
//     await saveConvertedInvestorCollectionToDB();
//     console.timeEnd(`Execute time investors-save-db ${id6}`);
//     console.timeEnd(`Execute time investors ${id5}`);
// }, 0);

// transactions
// setInterval(async () => {
//     log("Run transactions ...");
//     console.time(`Execute time transactions ${++id7}`);
//     await saveConvertedTransactionsToFile();
//     await dropDBMainCollection("transactions");
//     console.time(`Execute time transactions-save-db ${++id8}`);
//     await saveConvertedTransactionsToDB();
//     console.timeEnd(`Execute time transactions-save-db ${id8}`);
//     console.timeEnd(`Execute time transactions ${id7}`);
// }, 600000);

/* 2. Run every day: Backup all datas */
// setInterval(async () => {
//     log("Run backup ...");
//     console.time(`Execute time backup ${++id9}`);
//     await backupDBMainDatas();
//     await backupDBCrawlDatas();
//     console.timeEnd(`Execute time backup ${id9}`);
// }, 600000);
