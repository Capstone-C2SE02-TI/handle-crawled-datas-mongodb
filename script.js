const cron = require("node-cron");
const { fs, log } = require("./constants");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlTagModel,
    DBMainAdminModel,
    DBMainSharkModel,
    DBMainTagModel,
    DBMainTokenModel,
    DBMainCoinModel,
    DBMainTransactionModel,
    DBMainUserModel
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
    addTransactionCollectionId
} = require("./features/write");
const { exportCollection, getCollectionDatas } = require("./features/read");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");

const runScript = async () => {
    await saveConvertedInvestorCollectionToDB();
};

runScript();

// #region CLOSE
// //#region Automation Scripts
// const scriptsRunEvery10Minutes = async () => {};
// const scriptsRunEveryHour = async () => {};
// const scriptsRunEveryDay = async () => {
//     // await backupDBCrawlDatas();
//     // await backupDBMainDatas();
// };
// //#endregion

// //#region Cronjob
// // Every 10 minutes
// cron.schedule("*/10 * * * *", async () => {
//     await scriptsRunEvery10Minutes();
// });

// // Every hour at 0th minute
// cron.schedule("0 * * * *", async () => {
//     await scriptsRunEveryHour();
// });

// // Every day at 00:00:00
// cron.schedule("0 0 * * *", async () => {
//     await scriptsRunEveryDay();
// });
// //#endregion
// #endregion
