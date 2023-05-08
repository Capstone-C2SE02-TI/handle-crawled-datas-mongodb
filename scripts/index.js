import {
	log,
	TWO_MINUTES_SECONDS,
	TEN_MINUTES_SECONDS
} from "../constants/index.js";
import { saveCategoriesToFile, saveCategoriesToDB } from "../functions/tags.js";
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
} from "../functions/coins.js";
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
	getFollowersOldDatas
} from "../functions/investors.js";
import {
	handleEachTransaction,
	convertTransactions,
	saveConvertedTransactionsToFile,
	saveConvertedTransactionsToDB,
	handleDetailChartTransaction
} from "../functions/transactions.js";
import { dropDBMainCollection } from "../functions/index.js";
import { DBMainTransactionModel } from "../models/index.js";
let id1 = 0,
	id2 = 0,
	id3 = 0,
	id4 = 0,
	id5 = 0,
	id6 = 0,
	id7 = 0,
	id8 = 0,
	id9 = 0;

const scripts = async () => {
	// tags
	// setInterval(async () => {
	//     log("Run tags ...");
	//     console.time(`Time tags ${++id1}`);
	//     await saveCategoriesToFile();
	//     await dropDBMainCollection("tags");
	//     console.time(`Time tags-save-db ${++id2}`);
	//     await saveCategoriesToDB();
	//     console.timeEnd(`Time tags-save-db ${id2}`);
	//     console.timeEnd(`Time tags ${id1}`);
	// }, TEN_MINUTES_SECONDS);
	// coins
	// setInterval(async () => {
	//     log("Run coins ...");
	//     console.time(`Time coins ${++id3}`);
	//     await saveCoinsToFile();
	//     await saveConvertedCoinCollectionToFile();
	//     console.time(`Time coins-save-db ${++id4}`);
	//     saveConvertedCoinCollectionToDB(id4);
	//     console.timeEnd(`Time coins ${id3}`);
	// }, TEN_MINUTES_SECONDS);
	// investors
	// setInterval(async () => {
	//     log("Run investors ...");
	//     console.time(`Time investors-save-file ${++id5}`);
	//     await saveInvestorsToFile();
	//     console.timeEnd(`Time investors-save-file ${id5}`);
	//     console.time(`Time investors-save-db ${++id6}`);
	//     await convertAndSaveInvestorsToDB(id6);
	// }, TEN_MINUTES_SECONDS);
	// transactions
	// setInterval(async () => {
	//     log("Run transactions ...");
	//     console.time(`Time transactions ${++id7}`);
	//     await dropDBMainCollection("transactions");
	//     console.time(`Time transactions-save-db ${++id8}`);
	//     await saveConvertedTransactionsToDB();
	//     console.timeEnd(`Time transactions-save-db ${id8}`);
	//     console.timeEnd(`Time transactions ${id7}`);
	// }, TEN_MINUTES_SECONDS);
};

export default scripts;
