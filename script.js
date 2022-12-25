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
    DBCrawlCoinsDatas,
    DBCrawlInvestorsDatas,
    DBCrawlCategoriesDatas,
    DBMainAdminsDatas,
    DBMainInvestorsDatas,
    DBMainTagsDatas,
    DBMainCoinsDatas,
    DBMainTransactionsDatas,
    DBMainUsersDatas
} = require("./databases");
const {
    dropDBMainCollection,
    dropDBCrawlCollection,
    handleTokensPrices,
    saveCoinsToFile,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
    handleTradeTransaction,
    updateInvestorTradeTransaction,
    handleFormatTradeTransactionDataCrawl,
    handleFormatTradeTransactionDataMain,
    updateInvestorHistoryDatasTest,
    getListTransactionsOfInvestor,
    convertInvestorsCollection,
    saveInvestorsToFile,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorCollectionToDB,
    saveCategoriesToDB,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    calculateInvestorPercent24h,
    handleDetailChartTransaction,
    renameTransactionCollectionField,
    removeFieldInMultipleCollection
} = require("./features/write");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");

// Run every 10 minutes: Update all collection datas
// cron.schedule("*/10 * * * *", async () => {
//     // Tags
//     await dropDBMainCollection("tags");
//     await saveCategoriesToDB();

//     // Coins
//     await dropDBMainCollection("coins");
//     await saveCoinsToFile();
//     await saveConvertedCoinCollectionToFile();
//     await saveConvertedCoinCollectionToDB();

//     // Investors
//     await dropDBMainCollection("investors");
//     await saveInvestorsToFile();
//     await saveConvertedInvestorCollectionToFile();
//     await saveConvertedInvestorCollectionToDB();

//     // Transactions
//     await dropDBMainCollection("transactions");
//     await saveConvertedTransactionsToFile();
//     await saveConvertedTransactionsToDB();
// });

// Run every day at 00:00: Backup all collection datas
// cron.schedule("0 0 * * *", async () => {
// await backupDBMainDatas();
// await backupDBCrawlDatas();
// });

const runScript = async () => {
    console.time("Execute time");

    await dropDBMainCollection("investors");
    await saveInvestorsToFile();
    await saveConvertedInvestorCollectionToFile();
    await saveConvertedInvestorCollectionToDB();

    console.timeEnd("Execute time");
};

runScript();
