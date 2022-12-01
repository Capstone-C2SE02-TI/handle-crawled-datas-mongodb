const cron = require("node-cron");
const { log } = require("console");
const { fs } = require("./constants");
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
    saveTagCollectionToDB,
    handleDetailChartTransaction,
    updateSharkHistoryDatas,
    generateAndWriteSchemaInFile
} = require("./features/write");
const { generateSchemaFromJsonData } = require("./features/handle");
const { exportCollection, getDBCrawlCollection } = require("./features/read");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");

const runScript = async () => {
    await saveConvertedInvestorCollectionToFile();
    // await saveConvertedInvestorCollectionToDB();
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
