import mongoose from "mongoose";
import { dbCrawlConnection } from "../../configs/connectDatabase/index.js";

const InvestorSchema = new mongoose.Schema({
    // TXs: {
    //     type: Array
    // },
    // is_shark: {
    //     type: Boolean
    // },
    // snapshots: {
    //     type: Object
    // },
    // snapshot: {
    //     type: Number
    // },
    // latestBlockNumber: {
    //     type: Number
    // },
    // coins: {
    //     type: Array
    // }
});

const InvestorModel = dbCrawlConnection.model("Investor", InvestorSchema);

export default InvestorModel;
