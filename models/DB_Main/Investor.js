import mongoose from "mongoose";
import Inc from "mongoose-sequence";
const AutoIncrement = Inc(mongoose);
import { dbMainConnection } from "../../configs/connectDatabase/index.js";

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

InvestorSchema.plugin(AutoIncrement, { inc_field: "sharkId" });

const InvestorModel = dbMainConnection.model("Investor", InvestorSchema);

export default InvestorModel;
