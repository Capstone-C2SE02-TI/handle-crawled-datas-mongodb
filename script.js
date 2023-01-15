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
    saveConvertedInvestorsToDB,
    saveConvertedInvestorCollectionToDB,
    _saveConvertedTransactionsToDB,
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
// setInterval(async () => {
//     log("Run tags ...");
//     console.time(`Execute_time tags ${++id1}`);
//     await saveCategoriesToFile();
//     await dropDBMainCollection("tags");
//     console.time(`Execute_time tags-save-db ${++id2}`);
//     await saveCategoriesToDB();
//     console.timeEnd(`Execute_time tags-save-db ${id2}`);
//     console.timeEnd(`Execute_time tags ${id1}`);
// }, 600000);

// coins: 2 phút (120000), 10 phút (600000)
// setInterval(async () => {
//     log("Run coins ...");
//     console.time(`Execute_time coins ${++id3}`);
//     await saveCoinsToFile();
//     await saveConvertedCoinCollectionToFile();
//     console.time(`Execute_time coins-save-db ${++id4}`);
//     saveConvertedCoinCollectionToDB(id4);
//     console.timeEnd(`Execute_time coins ${id3}`);
// }, 120000);

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
// }, 600000);

// Testing ...
setTimeout(async () => {
    console.time(`Execute_time 1`);

    // await saveConvertedInvestorCollectionToFile(id5);

    // console.timeEnd(`Execute_time 1`);
}, 0);

// transactions
// setInterval(async () => {
//     log("Run transactions ...");
//     console.time(`Execute_time transactions ${++id7}`);
//     await dropDBMainCollection("transactions");
//     console.time(`Execute_time transactions-save-db ${++id8}`);
//     await _saveConvertedTransactionsToDB();
//     console.timeEnd(`Execute_time transactions-save-db ${id8}`);
//     console.timeEnd(`Execute_time transactions ${id7}`);
// }, 600000);

/* 2. Run every day: Backup all datas */
// setInterval(async () => {
//     log("Run backup ...");
//     console.time(`Execute_time backup ${++id9}`);
//     await backupDBMainDatas();
//     await backupDBCrawlDatas();
//     console.timeEnd(`Execute_time backup ${id9}`);
// }, 600000);
