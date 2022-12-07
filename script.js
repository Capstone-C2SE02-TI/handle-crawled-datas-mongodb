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
    DBCrawlMetadatasDatas,
    DBCrawlTagsDatas,
    DBCrawlTokensDatas,
    DBMainAdminsDatas,
    DBMainSharksDatas,
    DBMainTagsDatas,
    DBMainTokensDatas,
    DBMainTransactionsDatas,
    DBMainUsersDatas
} = require("./databases");
const {
    handleTokensPrices,
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
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorCollectionToDB,
    saveCategoriesToFile,
    saveCategoriesToDB,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    calculateInvestorPercent24h,
    handleDetailChartTransaction,
    updateSharkHistoryDatas,
    addTransactionCollectionId,
    renameTransactionCollectionField,
    removeFieldInMultipleCollection
} = require("./features/write");
const { exportCollection, getCollectionDatas } = require("./features/read");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");

// -- Automation Scripts --

// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {});

// Run every day at 00:00
cron.schedule("0 0 * * *", async () => {
    // await backupDBCrawlDatas();
    // await backupDBMainDatas();
});

const runScript = async () => {};

runScript();
