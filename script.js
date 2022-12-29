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
// // tags
// cron.schedule("*/10 * * * *", async () => {
//     await dropDBMainCollection("tags");
//     await saveCategoriesToDB();
// });

// // coins
// cron.schedule("*/10 * * * *", async () => {
//     await saveCoinsToFile();
//     await saveConvertedCoinCollectionToFile();
//     await dropDBMainCollection("coins");
//     await saveConvertedCoinCollectionToDB();
// });

// // investors
// cron.schedule("*/10 * * * *", async () => {
//     await dropDBMainCollection("investors");
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     await saveConvertedInvestorCollectionToDB();
// });

// // transactions
// cron.schedule("*/10 * * * *", async () => {
//     await dropDBMainCollection("transactions");
//     await saveConvertedTransactionsToFile();
//     await saveConvertedTransactionsToDB();
// });

/* 2. Run every day at 00:00: Backup all collection datas */
// cron.schedule("0 0 * * *", async () => {
//     await backupDBMainDatas();
//     await backupDBCrawlDatas();
// });

const runScript = async () => {
    console.time("Execute time");

    // await dropDBMainCollection("investors");
    // await saveInvestorsToFile();
    // await saveConvertedInvestorCollectionToFile();
    // await saveConvertedInvestorCollectionToDB();

    console.timeEnd("Execute time");
};

runScript();
