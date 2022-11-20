const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { dbCrawlConnection } = require("../../configs/connect-database");

const TagSchema = new mongoose.Schema({
    // _id: {
    //     type: "ObjectId"
    // },
    // name: {
    //     type: "String"
    // },
    // title: {
    //     type: "String"
    // },
    // description: {
    //     type: "String"
    // },
    // num_tokens: {
    //     type: "Number"
    // },
    // avg_price_change: {
    //     type: "Number"
    // },
    // market_cap: {
    //     type: "Number"
    // },
    // market_cap_change: {
    //     type: "Number"
    // },
    // volume: {
    //     type: "Number"
    // },
    // volume_change: {
    //     type: "Number"
    // },
    // last_updated: {
    //     type: "Date"
    // }
});

const TagModel = dbCrawlConnection.model("Tag", TagSchema);

module.exports = TagModel;
