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

const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getDBMainTags = async () => {
    const tags = await DBCrawlTagModel.find({
        name: "Internet Computer Ecosystem"
    })
        // .sort("id")
        // .select(
        //     "name title description num_tokens avg_price_change market_cap market_cap_change volume volume_change -_id"
        // );
        .select("name title volume_change -_id");

    return tags;
};

module.exports = {
    exportCollection,
    getDBMainTags
};
