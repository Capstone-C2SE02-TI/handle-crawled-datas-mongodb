const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlCategoryModel,
    DBMainAdminModel,
    DBMainSharkModel,
    DBMainTagModel,
    DBMainTokenModel,
    DBMainCoinModel,
    DBMainTransactionModel,
    DBMainUserModel
} = require("../models");

const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getDBCrawlCollection = async () => {
    return await DBCrawlCategoryModel.find({});
};

const getCollectionLength = async (CollectionModel) => {
    return await CollectionModel.count({});
};

module.exports = {
    exportCollection,
    getDBCrawlCollection,
    getCollectionLength
};
