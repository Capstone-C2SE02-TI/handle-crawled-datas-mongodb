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
};

runScript();

//#region Cronjob - Automation Scripts
// Run every 10 minutes
cron.schedule("*/10 * * * *", async () => {
    await scriptsRunEvery10Minutes();
});

// Run every hour at 0th minute
cron.schedule("0 * * * *", async () => {
    await scriptsRunEveryHour();
});

// Run every day at 00:00:00
cron.schedule("0 0 * * *", async () => {
    // await backupDBCrawlDatas();
    // await backupDBMainDatas();
});
//#endregion
