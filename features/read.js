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
} = require("../models");

const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getDBCrawlCollection = async () => {
    const coins = await DBCrawlInvestorModel.find({});
    // .sort("id")
    // .select(
    //     "name title description num_tokens avg_price_change market_cap market_cap_change volume volume_change -_id"
    // );
    // .select("name title volume_change -_id");

    return coins;
};

module.exports = {
    exportCollection,
    getDBCrawlCollection
};
