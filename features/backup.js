const { fs, log } = require("../constants");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlCategoryModel,
    DBMainAdminModel,
    DBMainTagModel,
    DBMainCoinModel,
    DBMainInvestorModel,
    DBMainTransactionModel,
    DBMainUserModel
} = require("../models");
const { exportCollection } = require("./read");

const backupDBCrawlDatas = async () => {
    const coins = await exportCollection(DBCrawlCoinModel);
    const investors = await exportCollection(DBCrawlInvestorModel);
    const categories = await exportCollection(DBCrawlCategoryModel);

    const collectionDatas = [coins, investors, categories];
    const collectionNames = ["coins", "investors", "categories"];

    const promises = collectionNames.map((collectionName, index) => {
        return fs.writeFileAsync(
            `./databases/BACKUP/${collectionName}.json`,
            // `./databases/DB_Crawl/${collectionName}.json`,
            JSON.stringify(collectionDatas[index]),
            (error) => {
                if (error) {
                    log(`Backup file ${collectionName}.json error`);
                    throw new Error(error);
                }
            }
        );
    });

    Promise.all(promises)
        .then(() => {
            log("Backup files success");
        })
        .catch((error) => {
            log("Backup files error");
            throw new Error(error);
        });
};

const backupDBMainDatas = async () => {
    const admins = await exportCollection(DBMainAdminModel);
    const users = await exportCollection(DBMainUserModel);
    const tags = await exportCollection(DBMainTagModel);
    const coins = await exportCollection(DBMainCoinModel);
    const investors = await exportCollection(DBMainInvestorModel);
    const transactions = await exportCollection(DBMainTransactionModel);

    const collectionDatas = [
        admins,
        users,
        tags,
        coins,
        investors,
        transactions
    ];
    const collectionNames = [
        "admins",
        "users",
        "tags",
        "coins",
        "investors",
        "transactions"
    ];

    const promises = collectionNames.map((collectionName, index) => {
        return fs.writeFileAsync(
            `./databases/BACKUP/${collectionName}.json`,
            // `./databases/DB_Main/${collectionName}.json`,
            JSON.stringify(collectionDatas[index]),
            (error) => {
                if (error) {
                    log(`Backup file ${collectionName}.json error`);
                    throw new Error(error);
                }
            }
        );
    });

    Promise.all(promises)
        .then(() => {
            log("Backup files success");
        })
        .catch((error) => {
            log("Backup files error");
            throw new Error(error);
        });
};

module.exports = {
    backupDBMainDatas,
    backupDBCrawlDatas
};
