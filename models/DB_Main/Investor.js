const mongoose = require("mongoose");
const { dbMainConnection } = require("../../configs/connect-database");

const InvestorSchema = new mongoose.Schema(
    {
        sharkId: {
            type: Number
        },
        isShark: {
            type: Boolean,
            default: false
        },
        coins: {
            type: Object,
            default: {}
        },
        totalAssets: {
            type: String,
            default: ""
        },
        percent24h: {
            type: Number,
            default: 0
        },
        transactionsHistory: {
            type: Array,
            default: []
        },
        walletAddress: {
            type: String,
            default: ""
        },
        cryptos: {
            type: Array,
            default: []
        },
        historyDatas: {
            type: Array,
            default: []
        },
        followers: {
            type: Array,
            default: []
        }
    },
    { versionKey: false }
);

const InvestorModel = dbMainConnection.model("Investor", InvestorSchema);

module.exports = InvestorModel;
