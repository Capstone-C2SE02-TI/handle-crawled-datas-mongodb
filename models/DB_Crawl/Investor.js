const mongoose = require("mongoose");
const { dbCrawlConnection } = require("../../configs/connectDatabase");

const InvestorSchema = new mongoose.Schema({
    TXs: {
        type: Array
    },
    is_shark: {
        type: Boolean
    },
    snapshots: {
        type: Object
    },
    snapshot: {
        type: Number
    },
    latestBlockNumber: {
        type: Number
    },
    coins: {
        type: Array
    },
});

const InvestorModel = dbCrawlConnection.model("Investor", InvestorSchema);

module.exports = InvestorModel;
