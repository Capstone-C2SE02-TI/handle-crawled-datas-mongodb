const { log } = require("../constants");
const { dbMainConnection } = require("../configs/connectDatabase");

const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getCollectionLength = async (CollectionModel) => {
    return await CollectionModel.count({});
};

const dropDBMainCollection = async (collectionName) => {
    await dbMainConnection.dropCollection(collectionName, (error, result) => {
        if (error) {
            log(`Drop collection ${collectionName} failed`);
            throw new Error(error);
        } else {
            log(`Drop collection ${collectionName} successfully`);
        }
    });
};

module.exports = {
    exportCollection,
    getCollectionLength,
    dropDBMainCollection
};
