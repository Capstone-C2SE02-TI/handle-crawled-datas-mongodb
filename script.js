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
let ID1 = 0,
    ID2 = 0,
    ID3 = 0,
    ID4 = 0,
    ID5 = 0;

/* 1. Run every 10 minutes: Update collection datas */
// tags
// cron.schedule("*/10 * * * *", async () => {
//     log("Run tags ...");
//     console.time(`Execute time tags ${++ID1}`);
//     await saveCategoriesToFile();
//     await dropDBMainCollection("tags");
//     await saveCategoriesToDB();
//     console.timeEnd(`Execute time tags ${ID1}`);
// });

// coins
// cron.schedule("*/10 * * * *", async () => {
//     log("Run coins ...");
//     console.time(`Execute time coins ${++ID2}`);
//     await saveCoinsToFile();
//     await saveConvertedCoinCollectionToFile();
//     await dropDBMainCollection("coins");
//     await saveConvertedCoinCollectionToDB();
//     console.timeEnd(`Execute time coins ${ID2}`);
// });

// investors
// cron.schedule("*/10 * * * *", async () => {
//     log("Run investors ...");
//     console.time(`Execute time investors ${++ID3}`);
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     await dropDBMainCollection("investors");
//     await saveConvertedInvestorCollectionToDB();
//     console.timeEnd(`Execute time investors ${ID3}`);
// });

// transactions
// cron.schedule("*/10 * * * *", async () => {
//     log("Run transactions ...");
//     console.time(`Execute time transactions ${++ID4}`);
//     await saveConvertedTransactionsToFile();
//     await dropDBMainCollection("transactions");
//     await saveConvertedTransactionsToDB();
//     console.timeEnd(`Execute time transactions ${ID4}`);
// });

/* 2. Run every day at 00:00: Backup all datas */
// cron.schedule("0 0 * * *", async () => {
//     log("Run backup ...");
//     console.time(`Execute time backup ${++ID5}`);
//     await backupDBMainDatas();
//     await backupDBCrawlDatas();
//     console.timeEnd(`Execute time backup ${ID5}`);
// });

const runScript = async () => {
    console.time(`Execute time test`);

    // await saveInvestorsToFile();
    // await saveConvertedInvestorCollectionToFile();
    // await dropDBMainCollection("investors");
    // await saveConvertedInvestorCollectionToDB();

    // await saveConvertedTransactionsToFile();
    // await dropDBMainCollection("transactions");
    // await saveConvertedTransactionsToDB();

    await updateInvestorTransactionsHistoryTotalValueFirstTrans();

    console.timeEnd(`Execute time test`);
};

runScript();
