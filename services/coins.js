import { fs, log } from "../constants/index.js";
import {
	convertUnixTimestampToNumber,
	getTodayDay,
	getNearest7Days,
	getThisMonthYear,
	getNearest12Months
} from "../helpers/index.js";
import { DBCrawlCoinModel, DBMainCoinModel } from "../models/index.js";
import ids from "../databases/DB_Crawl/ids.json" assert { type: "json" };
// import coins from "../databases/DB_Crawl/coins.json" assert { type: "json" };
import coins from "../databases/DB_Crawl/output2.json" assert { type: "json" };
import coinsConverted from "../databases/DB_Crawl/coins-converted.json" assert { type: "json" };

// [Need comment-uncomment 4 below function calls]
export const handleTokensPrices = (coinsPrices) => {
	if (!coinsPrices)
		return {
			day: null,
			week: null,
			month: null,
			year: null
		};

	const { hourly, daily } = coinsPrices;

	// 1. DAY
	let days = {};
	let currentDay = 20230523;
	// let currentDay = getTodayDay();

	if (hourly) {
		Object.keys(hourly).forEach((key) => {
			const cv = convertUnixTimestampToNumber(key.slice(0, 10));
			if (Math.floor(cv / 1000000) == currentDay) {
				days[key] = hourly[`${key}`];
			}
		});
	} else {
		days = null;
	}

	// 2. WEEK
	let weeks = {};
	let currentDays = [
		20230517, 20230518, 20230519, 20230520, 20230521, 20230522, 20230523
	];
	// let currentDays = getNearest7Days();

	if (daily) {
		Object.keys(daily).forEach((key) => {
			const cv = convertUnixTimestampToNumber(key.slice(0, 10));
			if (currentDays.includes(Math.floor(cv / 1000000))) {
				weeks[key] = daily[`${key}`];
			}
		});
	} else {
		weeks = null;
	}

	// 3. MONTH
	let months = {};
	let currentMonthYear = 202305;
	// let currentMonthYear = getThisMonthYear();

	if (daily) {
		Object.keys(daily).forEach((key) => {
			const cv = convertUnixTimestampToNumber(key.slice(0, 10));
			if (Math.floor(cv / 100000000) == currentMonthYear) {
				months[key] = daily[`${key}`];
			}
		});
	} else {
		months = null;
	}

	// 4. YEAR
	let years = {};
	const currentMonthYears = [
		202206, 202207, 202208, 202209, 202210, 202211, 202212, 202301, 202302,
		202303, 202304, 202305
	];
	// const currentMonthYears = getNearest12Months();

	if (daily) {
		Object.keys(daily).forEach((key) => {
			const cv = convertUnixTimestampToNumber(key.slice(0, 10));
			if (currentMonthYears.includes(Math.floor(cv / 100000000))) {
				years[key] = daily[`${key}`];
			}
		});
	} else {
		years = null;
	}

	log({
		day: days,
		week: weeks,
		month: months,
		year: years
	});

	return {
		day: days,
		week: weeks,
		month: months,
		year: years
	};
};

export const saveCoinsToFile = async () => {
	const datas = await DBCrawlCoinModel.find({}).lean();

	await fs.writeFileAsync(
		`./databases/DB_Crawl/coins0.json`,
		JSON.stringify(datas),
		(error) => {
			if (error) {
				log(`Write file coins.json error`);
				throw new Error(error);
			}
		}
	);

	log("Write coins into file successfully");
};

export const convertCoinsCollection = async () => {
	let coinsList = [];

	for (let i = 0; i < coins.length; i++) {
		const prices = handleTokensPrices(coins[i].prices);

		coinsList.push({
			coinId: i + 1,
			originalPrices: {
				hourly: coins[i].prices.hourly || null,
				daily: coins[i].prices.daily || null
			},
			circulatingSupply: coins[i].market_data?.circulating_supply || null,
			coingeckoId: ids[i]._id,
			ethId: ids[i]._id,
			iconURL: coins[i].image?.thumb || "",
			type: coins[i].asset_platform_id === null ? "coin" : "token",
			urls: coins[i].links,
			cmcRank: coins[i].market_data?.market_cap_rank || null,
			totalSupply: coins[i].market_data?.total_supply || null,
			contractAddress: coins[i].contract_address || "",
			usd: {
				volume24h: coins[i].market_data?.total_volume?.usd,
				price: coins[i].market_data?.current_price?.usd || null,
				percentChange7d:
					coins[i].market_data?.price_change_percentage_7d_in_currency?.usd ||
					null,
				percentChange24h:
					coins[i].market_data?.price_change_percentage_24h_in_currency?.usd ||
					null,
				_24hHigh: coins[i].market_data?.high_24h?.usd || null,
				_24hLow: coins[i].market_data?.low_24h?.usd || null,
				allTimeHigh: coins[i].market_data?.ath?.usd || null,
				allTimeLow: coins[i].market_data?.atl?.usd || null,
				fullyDilutedValuation:
					coins[i].market_data?.fully_diluted_valuation?.usd || null
			},
			symbol: coins[i].symbol,
			tagNames: coins[i].categories,
			maxSupply: coins[i].market_data?.max_supply || null,
			name: coins[i].name,
			prices: prices || null,
			pricesLast1Month: prices.month || null,
			marketCap: coins[i].market_data?.market_cap?.usd || null,
			totalInvestment: coins[i].sumInvest || 0
		});
	}

	return coinsList;
};

export const saveConvertedCoinCollectionToFile = async () => {
	const datas = await convertCoinsCollection();

	await fs.writeFileAsync(
		`./databases/DB_Crawl/coins-converted.json`,
		JSON.stringify(datas),
		(error) => {
			if (error) {
				log(`Write file coins-converted.json error`);
				throw new Error(error);
			}
		}
	);

	log("Write coins into file successfully");
};

export const handleUpdateCoin = (start, end, isLog, id4) => {
	for (let i = start; i < end; i++) {
		try {
			DBMainCoinModel.findOneAndUpdate(
				{ coinId: i + 1 },
				{ ...coinsConverted[i], updateDate: new Date().toString() }
			)
				.lean()
				.then()
				.catch((error) => {
					log(`Update coin ${i + 1} in DB failed`);
					throw new Error(error);
				});

			// DBMainCoinModel.create({
			// 	...coinsConverted[i],
			// 	updateDate: new Date().toString()
			// })
			// 	.then()
			// 	.catch((error) => {
			// 		log(`Update coin ${i + 1} in DB failed`);
			// 		throw new Error(error);
			// 	});

			if (isLog && i == end - 1) console.timeEnd(`Time coins-save-db ${id4}`);
		} catch (error) {
			log(`Update coin ${i + 1} in DB failed`);
			throw new Error(error);
		}
	}
};

// [Number of threads: 186 docs / 10 = 18 threads]
export const saveConvertedCoinCollectionToDB = (id4) => {
	let len = coinsConverted.length,
		limit = Math.floor(len / 10),
		jump = 10,
		start = 0,
		end = start + jump;

	for (let i = 0; i < limit; i++) {
		setTimeout(() => {
			if (i == limit - 1) handleUpdateCoin(start, len, true, id4);
			else handleUpdateCoin(start, end);

			start = start + jump;
			end = start + jump;
		}, 0);
	}

	log("Update coins in DB successfully");
};

export const getValueFromPromise = async (promiseValue) => {
	return await Promise.all(promiseValue);
};

export const getOriginalPriceOfToken = async (tokenSymbol) => {
	const token = await DBMainCoinModel.findOne({
		symbol: tokenSymbol.toLowerCase()
	})
		.select("originalPrices -_id")
		.lean();

	return token?.originalPrices || null;
};

export const getDateNearTransaction = (dateList, dateTransaction) => {
	let datePricesTokenCut = dateList.map((date) => {
		return date["date"].slice(0, 10);
	});

	let dateTransactionCut = dateTransaction.slice(0, 10);
	let positionDate = null;

	// cut hour
	let dateCutByHours = datePricesTokenCut.filter((date, index) => {
		if (Number(date) === Number(dateTransactionCut)) positionDate = index;
		return Number(date) === Number(dateTransactionCut);
	});

	if (dateCutByHours.length > 0) {
		// date transaction before date change price
		if (Number(dateTransaction) < Number(dateList[positionDate]))
			return positionDate === dateList.length - 1
				? dateList[dateList.length - 1]
				: dateList[positionDate + 1];
		else return dateList[positionDate];
	}

	// cut date
	if (positionDate === null) {
		let dateCutByDates = datePricesTokenCut.filter((date, index) => {
			date = date.slice(0, 8);
			if (Number(date) === Number(dateTransactionCut.slice(0, 8)))
				positionDate = index;
			return Number(date) === Number(dateTransactionCut.slice(0, 8));
		});

		let hourTrade = dateTransactionCut.slice(8);
		let datesCutLength = dateCutByDates.length;
		for (let i = 0; i < datesCutLength; i++) {
			if (Number(hourTrade) > Number(dateCutByDates[i].slice(8)))
				return dateList[positionDate - datesCutLength + i + 1];
		}
	}

	return positionDate === null
		? {
				date: "notfound",
				value: 0
		  }
		: positionDate === dateList.length - 1
		? dateList[dateList.length - 1]
		: dateList[positionDate + 1];
};

export const getPriceWithDaily = (dailyPrice, dateTransaction) => {
	if (typeof dailyPrice !== "undefined") {
		dailyPrice = Object.keys(dailyPrice).map((unixDate) => {
			let date = convertUnixTimestampToNumber(unixDate);
			date = date.toString();
			return {
				date: date,
				value: dailyPrice[unixDate]
			};
		});

		dailyPrice.sort(
			(firstObj, secondObj) => secondObj["date"] - firstObj["date"]
		);

		const dateNearTransaction = getDateNearTransaction(
			dailyPrice,
			dateTransaction
		);
		return dateNearTransaction;
	}

	return { date: "none", value: 0 };
};

export const handleInvestorTransactionHistory = async (transactions) => {
	let promises = await transactions.map(async (transaction) => {
		let numberOfTokens =
			Number(transaction["value"]) / 10 ** Number(transaction["tokenDecimal"]);

		let originalPrices = await getOriginalPriceOfToken(
			transaction["tokenSymbol"]
		);

		let hoursPrice = originalPrices?.hourly;

		if (hoursPrice) {
			hoursPrice = Object.keys(hoursPrice).map((unixDate) => {
				let date = convertUnixTimestampToNumber(unixDate);
				date = date.toString();
				return {
					date: date,
					value: hoursPrice[unixDate]
				};
			});

			hoursPrice.sort(
				(firstObj, secondObj) => secondObj["date"] - firstObj["date"]
			);
		}

		let presentData =
			typeof hoursPrice !== "undefined" ? hoursPrice[0] : undefined;

		const dateTransac = convertUnixTimestampToNumber(transaction["timeStamp"]);
		let dateNearTransaction =
			typeof hoursPrice !== "undefined"
				? getDateNearTransaction(hoursPrice, dateTransac.toString())
				: { date: "none", value: 0 };

		if (dateNearTransaction.date === "notfound") {
			let dailyPrice = originalPrices.daily;
			dateNearTransaction = getPriceWithDaily(
				dailyPrice,
				dateTransac.toString()
			);
		}

		let presentPrice =
			typeof presentData === "undefined" ? 0 : presentData["value"];

		let presentDate =
			typeof presentData === "undefined" ? "none" : presentData["date"];

		Object.assign(transaction, {
			numberOfTokens: numberOfTokens,
			pastDate: dateNearTransaction["date"],
			pastPrice: dateNearTransaction["value"],
			presentDate: presentDate,
			presentPrice: presentPrice
		});

		return transaction;
	});

	return await getValueFromPromise(promises);
};

export const getCoinOrTokenDetails = async (coinSymbol) => {
	const coinOrToken = await DBMainCoinModel.findOne({
		symbol: coinSymbol.toLowerCase()
	})
		.select("coinId name type symbol iconURL cmcRank tagNames usd -_id")
		.lean();

	return coinOrToken || {};
};
