const cron = require("node-cron");
const { log } = require("console");
const { setTimeout } = require("timers/promises");
const { writeFileSync } = require("fs");
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

const scriptsRunEvery10Minutes = async () => {};

const scriptsRunEveryHour = async () => {};

const scriptsRunEveryDay = async () => {
    await backupDatas();
};

const backupDatas = async () => {
    const admins = await exportCollection(AdminModel);
    const sharks = await exportCollection(SharkModel);
    const tags = await exportCollection(TagModel);
    const tokens = await exportCollection(TokenModel);
    const transactions = await exportCollection(TransactionModel);
    const users = await exportCollection(UserModel);

    writeFileSync(
        "./databases/DB_Main/admins.json",
        JSON.stringify(admins),
        (error) => console.error(error),
    );
    writeFileSync(
        "./databases/DB_Main/sharks.json",
        JSON.stringify(sharks),
        (error) => console.error(error),
    );
    writeFileSync(
        "./databases/DB_Main/tags.json",
        JSON.stringify(tags),
        (error) => console.error(error),
    );
    writeFileSync(
        "./databases/DB_Main/tokens.json",
        JSON.stringify(tokens),
        (error) => console.error(error),
    );
    writeFileSync(
        "./databases/DB_Main/transactions.json",
        JSON.stringify(transactions),
        (error) => console.error(error),
    );
    writeFileSync(
        "./databases/DB_Main/users.json",
        JSON.stringify(users),
        (error) => console.error(error),
    );
};

const runScript = async () => {
    await backupDatas();
};

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

runScript();
