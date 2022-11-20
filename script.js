const cron = require("node-cron");
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require("fs"));
const { log } = require("console");
const { setTimeout } = require("timers/promises");

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

const backupDatas = async () => {
    const admins = await exportCollection(AdminModel);
    const sharks = await exportCollection(SharkModel);
    const tags = await exportCollection(TagModel);
    const tokens = await exportCollection(TokenModel);
    const transactions = await exportCollection(TransactionModel);
    const users = await exportCollection(UserModel);

    const collectionDatas = [admins, sharks, tags, tokens, transactions, users];
    const collectionNames = [
        "admins",
        "sharks",
        "tags",
        "tokens",
        "transactions",
        "users",
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
            },
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

const scriptsRunEvery10Minutes = async () => {};

const scriptsRunEveryHour = async () => {};

const scriptsRunEveryDay = async () => {
    // await backupDatas();
};

const runScript = async () => {
    // await backupDatas();
};

runScript();

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
