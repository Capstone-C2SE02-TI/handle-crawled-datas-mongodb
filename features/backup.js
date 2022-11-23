const { fs } = require("../constants");
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
} = require("../models");

const backupDBMainDatas = async () => {
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

const backupDBCrawlDatas = async () => {
    const coins = await exportCollection(DBCrawlCoinModel);
    const investors = await exportCollection(DBCrawlInvestorModel);
    const metadatas = await exportCollection(DBCrawlMetadataModel);
    const tags = await exportCollection(DBCrawlTagModel);
    const tokens = await exportCollection(DBCrawlTokenModel);

    const collectionDatas = [coins, investors, metadatas, tags, tokens];
    const collectionNames = [
        "coins",
        "investors",
        "metadatas",
        "tags",
        "tokens"
    ];

    const promises = collectionNames.map((collectionName, index) => {
        return fs.writeFileAsync(
            `./databases/DB_Crawl/${collectionName}.json`,
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
