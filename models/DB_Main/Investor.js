const mongoose = require("mongoose");
const { dbMainConnection } = require("../../configs/connectDatabase");

const InvestorSchema = new mongoose.Schema(
    {
        isShark: {
            type: Boolean,
            default: false
        },
        sharkId: {
            type: Number
        },
        coins: {
            type: Object,
            default: {}
        },
        totalAssets: {
            type: String,
            default: "0"
        },
        totalValueOut: {
            type: String,
            default: "0"
        },
        totalValueIn: {
            type: String,
            default: "0"
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
        },
        firstTransactionDate: {
            type: Number,
            default: 0
        },
        updateDate: {
            type: String,
            default: new Date().toString()
        }
    },
    { versionKey: false }
);

const InvestorModel = dbMainConnection.model("Investor", InvestorSchema);

module.exports = InvestorModel;
