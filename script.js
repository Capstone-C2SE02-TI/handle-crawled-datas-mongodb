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
    handleFormatTradeTransaction,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
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
    renameTransactionCollectionField
} = require("./features/write");
const { exportCollection, getCollectionDatas } = require("./features/read");
const { backupDBMainDatas, backupDBCrawlDatas } = require("./features/backup");

const runScript = async () => {
    // const datas = await handleFormatTradeTransaction();
    // await fs.writeFileAsync(
    //     `./databases/DB_Crawl/temp.json`,
    //     JSON.stringify(datas),
    //     (error) => {
    //         if (error) {
    //             log(`Backup file temp.json error`);
    //             throw new Error(error);
    //         }
    //     }
    // );
    // await saveConvertedInvestorCollectionToFile();
    // await saveConvertedInvestorCollectionToDB();

    // Test dữ liệu 
    const data = require(`./databases/DB_Crawl/investors-converted.json`);
    const LTS = await getListTransactionsOfInvestor(
        data[2].transactionsHistory
    );
    log(LTS);
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
