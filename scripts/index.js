import {
	fs,
	log,
	TWO_MINUTES_SECONDS,
	TEN_MINUTES_SECONDS
} from "../constants/index.js";
import {
	getTodayDay,
	getNearest7Days,
	getThisMonthYear,
	getNearest12Months
} from "../helpers/index.js";
import { saveCategoriesToFile, saveCategoriesToDB } from "../services/tags.js";
import {
	handleTokensPrices,
	saveCoinsToFile,
	convertCoinsCollection,
	saveConvertedCoinCollectionToFile,
	saveConvertedCoinCollectionToDB,
	getValueFromPromise,
	getOriginalPriceOfToken,
	getDateNearTransaction,
	getPriceWithDaily,
	handleInvestorTransactionHistory,
	getCoinOrTokenDetails
} from "../services/coins.js";
import {
	getListCryptosOfShark,
	calculateInvestorPercent24h,
	handleFormatTradeTransactionDataCrawl,
	handleFormatTradeTransactionDataMain,
	handleTradeTransaction,
	updateInvestorTradeTransaction,
	updateInvestorHistoryDatasTest,
	saveInvestorsToFile,
	convertAndSaveInvestorsToDB,
	saveConvertedInvestorsToDB,
	calculateTotalValueInOut,
	getFollowersOldDatas,
	updateTransactionsHistorySharkId
} from "../services/investors.js";
import {
	handleEachTransaction,
	convertTransactions,
	saveConvertedTransactionsToFile,
	saveConvertedTransactionsToDB,
	handleDetailChartTransaction
} from "../services/transactions.js";
import { dropDBMainCollection } from "../services/index.js";
import {
	DBMainTransactionModel,
	DBMainInvestorModel
} from "../models/index.js";
let id1 = 0,
	id2 = 0,
	id3 = 0,
	id4 = 0,
	id5 = 0,
	id6 = 0,
	id7 = 0,
	id8 = 0,
	id9 = 0;
import coinsConverted from "../databases/DB_Crawl/coins-converted.json" assert { type: "json" };

const scripts = async () => {
	// console.log(coinsConverted.length);
	// console.log(coinsConverted[0].prices.week);
	// console.log(coinsConverted[0].prices.month);
	// tags
	// setInterval(async () => {
	//     log("Run tags ...");
	//     console.time(`Time tags ${++id1}`);
	//     await saveCategoriesToFile();
	// await dropDBMainCollection("tags");
	//     console.time(`Time tags-save-db ${++id2}`);
	// await saveCategoriesToDB();
	//     console.timeEnd(`Time tags-save-db ${id2}`);
	//     console.timeEnd(`Time tags ${id1}`);
	// }, TEN_MINUTES_SECONDS);
	// coins
	// setInterval(async () => {
	//     log("Run coins ...");
	//     console.time(`Time coins ${++id3}`);
	// await saveCoinsToFile();
	// await saveConvertedCoinCollectionToFile();
	//     console.time(`Time coins-save-db ${++id4}`);
	//     saveConvertedCoinCollectionToDB(id4);
	//     console.timeEnd(`Time coins ${id3}`);
	// }, TEN_MINUTES_SECONDS);
	// investors
	// setInterval(async () => {
	//     log("Run investors ...");
	//     console.time(`Time investors-save-file ${++id5}`);
	// await saveInvestorsToFile();
	//     console.timeEnd(`Time investors-save-file ${id5}`);
	//     console.time(`Time investors-save-db ${++id6}`);
	// await convertAndSaveInvestorsToDB(id6);
	// }, TEN_MINUTES_SECONDS);
	// transactions
	// setInterval(async () => {
	//     log("Run transactions ...");
	//     console.time(`Time transactions ${++id7}`);
	//     await dropDBMainCollection("transactions");
	//     console.time(`Time transactions-save-db ${++id8}`);
	//	   await saveConvertedTransactionsToFile();
	// 	   await saveConvertedTransactionsToDB();
	//     console.timeEnd(`Time transactions-save-db ${id8}`);
	//     console.timeEnd(`Time transactions ${id7}`);
	// }, TEN_MINUTES_SECONDS);
	// await saveConvertedTransactionsToFile();
};

export default scripts;
