const cron = require("node-cron");
const {
    getListOfCoins,
    getListOfTokens,
    exportCollection,
    exportCollectionDatas,
} = require("./features/read-and-handle");
const {
    writeCoinsInDB,
    writeUsersInDB,
    writeSharksInDB,
    writeTagsInDB,
    reduceTokensInDB,
    updateTokensID,
    updateTokensDailyPrice,
    updateSharksFields,
    removeDocumentField,
    updateCoinId,
    updateTagNames,
    updateMetadata,
    updateTokensPrices,
    handleTokensPrices,
    updateTokensPriceLast1Day,
    handleDetailChartTransaction,
} = require("./features/write");
const {
    AdminModel,
    SharkModel,
    TagModel,
    TokenModel,
    TransactionModel,
    UserModel,
} = require("./models/DB_Main");

const scriptsRunEvery10Minutes = () => {};

const scriptsRunEveryHour = () => {};

const scriptsRunEveryDay = () => {};

const runScript = async () => {
    // Step 1: Read & Handle datas
    // const data1 = await exportCollection("users");
    // const data2 = await exportCollection("tokens");
    // const data3 = await exportCollection("tags");
    // const data4 = await exportCollection("sharks");
    // const data5 = await exportCollection("admins");
    // const data6 = await exportCollection("transactions");
    // Step 2: Save above datas in temp file
    // require("fs").writeFile("./db1.json", JSON.stringify(data1), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // require("fs").writeFile("./db2.json", JSON.stringify(data2), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // require("fs").writeFile("./db3.json", JSON.stringify(data3), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // require("fs").writeFile("./db4.json", JSON.stringify(data4), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // require("fs").writeFile("./db5.json", JSON.stringify(data5), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // require("fs").writeFile("./db6.json", JSON.stringify(data6), (err) => {
    //     if (err) {
    //         console.error(err);
    //     }
    // });
    // => Test function exportCollectionDatas
    // const data = await exportCollectionDatas(TokenModel);
    // console.log(data);
};

/* --- AUTOMATION EXECUTING --- */

// Every 10 minutes
cron.schedule("*/10 * * * *", () => {
    scriptsRunEvery10Minutes();
});

// Every hour at 0th minute
cron.schedule("0 * * * *", () => {
    scriptsRunEveryHour();
});

// Every day at 00:00:00
cron.schedule("0 0 * * *", () => {
    scriptsRunEveryDay();
});

runScript();
