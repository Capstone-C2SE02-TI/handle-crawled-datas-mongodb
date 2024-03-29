import mongoose from "mongoose";
import { dbMainConnection } from "../../configs/connectDatabase/index.js";

const CoinSchema = new mongoose.Schema(
	{
		coinId: {
			type: Number,
			default: null
		},
		ethId: {
			type: String,
			default: ""
		},
		coingeckoId: {
			type: String,
			default: ""
		},
		cmcRank: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			trim: true,
			// required: true,
			default: ""
		},
		symbol: {
			type: String,
			trim: true,
			// required: true
		},
		contractAddress: {
			type: String,
			trim: true,
			default: ""
		},
		type: {
			type: String,
			trim: true,
			default: ""
		},
		iconURL: {
			type: String,
			trim: true,
			default: ""
		},
		marketCap: {
			type: Number,
			default: null
		},
		maxSupply: {
			type: Number,
			default: null
		},
		totalSupply: {
			type: Number,
			default: null
		},
		circulatingSupply: {
			type: Number,
			default: null
		},
		tagNames: {
			type: Array,
			default: []
		},
		urls: {
			type: Object,
			required: true,
			default: {}
		},
		usd: {
			type: Object,
			required: true,
			default: {}
		},
		prices: {
			type: Object,
			default: {}
		},
		originalPrices: {
			type: Object,
			default: {}
		},
		pricesLast1Month: {
			type: Object,
			default: {}
		},
		totalInvestment: {
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

const CoinModel = dbMainConnection.model("Coin", CoinSchema);

export default CoinModel;
