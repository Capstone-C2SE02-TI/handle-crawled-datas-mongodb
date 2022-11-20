const cron = require("node-cron");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { log } = require("console");
const { setTimeout } = require("timers/promises");
const generateSchema = require("generate-schema");

const { exportCollection } = require("./features/read");
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
    handleDetailChartTransaction
} = require("./features/write");

const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlMetadataModel,
    DBCrawlTagModel,
    DBCrawlTokenModel,
    DBMainAdminModel,
    DBMainSharkModel,
    DBMainTagModel,
    DBMainTokenModel,
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

const backupDatas = async () => {
    const admins = await exportCollection(DBMainAdminModel);
    const sharks = await exportCollection(DBMainSharkModel);
    const tags = await exportCollection(DBMainTagModel);
    const tokens = await exportCollection(DBMainTokenModel);
    const transactions = await exportCollection(DBMainTransactionModel);
    const users = await exportCollection(DBMainUserModel);

    const collectionDatas = [admins, sharks, tags, tokens, transactions, users];
    const collectionNames = [
        "admins",
        "sharks",
        "tags",
        "tokens",
        "transactions",
        "users"
    ];

    const promises = collectionNames.map((collectionName, index) => {
        return fs.writeFileAsync(
            `./databases/DB_Main/${collectionName}.json`,
            JSON.stringify(collectionDatas[index]),
            (error) => {
                if (error) {
                    log(`Write file ${collectionName}.json error`);
                    throw new Error(error);
                }
            }
        );
    });

    Promise.all(promises)
        .then(() => {
            log("Write files success");
        })
        .catch((error) => {
            log("Write files error");
            throw new Error(error);
        });
};

const generateSchemaFromJsonData = async (jsonData) => {
    const Schema = generateSchema.mongoose(jsonData);
    return Schema;
};

//#region scripts
const scriptsRunEvery10Minutes = async () => {};
const scriptsRunEveryHour = async () => {};
const scriptsRunEveryDay = async () => {
    // await backupDatas();
};
//#endregion

const runScript = async () => {
    log(await generateSchemaFromJsonData());
};

runScript();

//#region Cronjob
// Every 10 minutes
cron.schedule("*/10 * * * *", async () => {
    await scriptsRunEvery10Minutes();
});

// Every hour at 0th minute
cron.schedule("0 * * * *", async () => {
    await scriptsRunEveryHour();
});

// Every day at 00:00:00
cron.schedule("0 0 * * *", async () => {
    await scriptsRunEveryDay();
});
//#endregion
