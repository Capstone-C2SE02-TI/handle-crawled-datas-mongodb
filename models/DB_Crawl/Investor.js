const mongoose = require("mongoose");
const { dbCrawlConnection } = require("../../configs/connect-database");

const InvestorSchema = new mongoose.Schema({
    // TXs: {
    //     type: "Array"
    // },
    // is_shark: {
    //     type: "Boolean"
    // },
    // snapshots: {
    //     type: "Object"
    // },
    // latestBlockNumber: {
    //     type: "Number"
    // }
});

const InvestorModel = dbCrawlConnection.model("Investor", InvestorSchema);

module.exports = InvestorModel;
