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
    updateInvestorsTotalValueInOut,
    saveCategoriesToFile,
    saveCategoriesToDB,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    calculateInvestorPercent24h,
    handleDetailChartTransaction,
    renameTransactionCollectionField,
    removeFieldInMultipleCollection
} = require("./features/write");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");

/* 1. Run every 10 minutes: Update collection datas */
// tags
// cron.schedule("*/10 * * * *", async () => {
//     console.time("Execute time");
//     await saveCategoriesToFile();
//     await dropDBMainCollection("tags");
//     await saveCategoriesToDB();
//     console.timeEnd("Execute time");
// });

// coins
// cron.schedule("*/10 * * * *", async () => {
//     console.time("Execute time");
//     await saveCoinsToFile();
//     await saveConvertedCoinCollectionToFile();
//     await dropDBMainCollection("coins");
//     await saveConvertedCoinCollectionToDB();
//     console.timeEnd("Execute time");
// });

// investors
// cron.schedule("*/10 * * * *", async () => {
//     console.time("Execute time");
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     await dropDBMainCollection("investors");
//     await saveConvertedInvestorCollectionToDB();
//     console.timeEnd("Execute time");
// });

// transactions
// cron.schedule("*/10 * * * *", async () => {
//     console.time("Execute time");
//     await saveConvertedTransactionsToFile();
//     await dropDBMainCollection("transactions");
//     await saveConvertedTransactionsToDB();
//     console.timeEnd("Execute time");
// });

/* 2. Run every day at 00:00: Backup all collection datas */
// cron.schedule("0 0 * * *", async () => {
//     console.time("Execute time");
//     await backupDBMainDatas();
//     await backupDBCrawlDatas();
//     console.timeEnd("Execute time");
// });

// let ID1 = 0;
// cron.schedule("* * * * *", async () => {
//     console.time(`Execute time ${++ID1}`);
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     await dropDBMainCollection("investors");
//     await saveConvertedInvestorCollectionToDB();
//     await updateInvestorsTotalValueInOut();
//     console.timeEnd(`Execute time ${ID1}`);
// });

const runScript = async () => {
    console.time(`Execute time`);
    
    // await saveInvestorsToFile();

    // await dropDBMainCollection("investors");
    // await saveConvertedInvestorCollectionToFile();
    // await saveConvertedInvestorCollectionToDB();
    // await updateInvestorsTotalValueInOut();

    console.timeEnd(`Execute time`);
};

runScript();
