const { fs, log } = require("../constants");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlCategoryModel,
    DBMainAdminModel,
    DBMainInvestorModel,
    DBMainTagModel,
    DBMainCoinModel,
    DBMainTransactionModel,
    DBMainUserModel
} = require("../models");
const {
    dbMainConnection,
    dbCrawlConnection
} = require("../configs/connect-database");
const { getCollectionLength } = require("./read");
const { convertUnixTimestampToNumber } = require("../helpers");

const dropDBMainCollection = async (collectionName) => {
    await dbMainConnection.dropCollection(collectionName, (error, result) => {
        if (error) {
            log(`Drop collection ${collectionName} failed`);
            throw new Error(error);
        } else {
            log(`Drop collection ${collectionName} successfully`);
        }
    });
};

const handleTokensPrices = (coinsPrices) => {
    if (!coinsPrices)
        return {
            day: null,
            week: null,
            month: null,
            year: null
        };

    const { hourly, daily } = coinsPrices;

    // 1. DAY => Thay 20221125 bằng ngày hiện tại
    let days = {};
    if (hourly) {
        Object.keys(hourly).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));

            if (Math.floor(cv / 1000000) == 20221125) {
                days[key] = hourly[`${key}`];
            }
        });
    } else {
        days = null;
    }

    // 2. WEEK => Thay mảng dates bằng giá trị 7 ngày gần nhất
    let weeks = {};
    let dates = [
        20221119, 20221120, 20221121, 20221122, 20221123, 20221124, 20221125
    ];

    if (daily) {
        Object.keys(daily).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (dates.includes(Math.floor(cv / 1000000))) {
                weeks[key] = daily[`${key}`];
            }
        });
    } else {
        weeks = null;
    }

    // 3. MONTH => Thay 202210 bằng giá trị tháng hiện tại (YYYYmm)
    let months = {};
    if (daily) {
        Object.keys(daily).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (Math.floor(cv / 100000000) == 202211) {
                months[key] = daily[`${key}`];
            }
        });
    } else {
        months = null;
    }

    // 4. YEAR => Thay monthYears bằng giá trị 12 gần nhất kể cả trừ tháng hiện tại
    let years = {};
    const monthYears = [
        202112, 202201, 202202, 202203, 202204, 202205, 202206, 202207, 202208,
        202209, 202210, 202211
    ];

    if (daily) {
        Object.keys(daily).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (monthYears.includes(Math.floor(cv / 100000000))) {
                years[key] = daily[`${key}`];
            }
        });
    } else {
        years = null;
    }

    return {
        day: days,
        week: weeks,
        month: months,
        year: years
    };
};

const saveCoinsToFile = async () => {
    const datas = await DBCrawlCoinModel.find({});

    await fs.writeFileAsync(
        `./databases/DB_Crawl/coins.json`,
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

const convertCoinsCollection = async () => {
    const coins = require("../databases/DB_Crawl/coins.json");
    const ids = require("../databases/DB_Crawl/ids.json");

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
                    coins[i].market_data?.price_change_percentage_7d_in_currency
                        ?.usd || null,
                percentChange24h:
                    coins[i].market_data
                        ?.price_change_percentage_24h_in_currency?.usd || null,
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

const saveConvertedCoinCollectionToFile = async () => {
    const datas = await convertCoinsCollection();

    await fs.writeFileAsync(
        `./databases/DB_Crawl/coins-converted.json`,
        JSON.stringify(datas),
        (error) => {
            if (error) {
                log(`Backup file coins-converted.json error`);
                throw new Error(error);
            }
        }
    );

    log("Write coins into file successfully");
};

const saveConvertedCoinCollectionToDB = async () => {
    const coins = require("../databases/DB_Crawl/coins-converted.json");

    for (let i = 0; i < coins.length; i++) {
        try {
            await DBMainCoinModel.create(coins[i])
                .then((data) => {})
                .catch((error) => {
                    log("Write coin in DB failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Write coin in DB failed");
            throw new Error(error);
        }
    }

    log("Write coins in DB successfully");
};

const getValueFromPromise = async (promiseValue) => {
    return await Promise.all(promiseValue);
};

const getHoursPriceOfToken = async (tokenSymbol) => {
    const token = await DBMainCoinModel.findOne({
        symbol: tokenSymbol.toLowerCase()
    }).select("originalPrices -_id");

    return token?.originalPrices?.hourly || null;
};

const getDateNearTransaction = (dateList, dateTransaction) => {
    let datePricesTokenCut = dateList.map((date) => {
        return date["date"].slice(0, 10);
    });

    let dateTransactionCut = dateTransaction.slice(0, 10);
    let positionDate = null;
    // Cut hour
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

const getPriceWithDaily = (dailyPrice, dateTransaction) => {
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

const updateTransactionsOfShark = async (sharkId) => {
    const rawData = await InvestorModel.find(
        { "transactionsHistory.500": { $exists: 0 }, isShark: 1 },
        { transactionsHistory: 1, sharkId: 1 }
    );

    await rawData.forEach(async (element) => {
        let transactions = await element.transactionsHistory.map(
            async (transaction) => {
                let numberOfTokens =
                    Number(transaction["value"]) /
                    10 ** Number(transaction["tokenDecimal"]);

                let originalPrices = await getOriginalPriceOfToken(
                    transaction["tokenSymbol"]
                );

                let hoursPrice = originalPrices.hourly;

                if (typeof hoursPrice !== "undefined") {
                    hoursPrice = Object.keys(hoursPrice).map((unixDate) => {
                        let date = convertUnixTimestampToNumber(unixDate);
                        date = date.toString();
                        return {
                            date: date,
                            value: hoursPrice[unixDate]
                        };
                    });

                    hoursPrice.sort(
                        (firstObj, secondObj) =>
                            secondObj["date"] - firstObj["date"]
                    );
                }

                let presentData =
                    typeof hoursPrice !== "undefined"
                        ? hoursPrice[0]
                        : undefined;

                const dateTransac = convertUnixTimestampToNumber(
                    transaction["timeStamp"]
                );
                let dateNearTransaction =
                    typeof hoursPrice !== "undefined"
                        ? getDateNearTransaction(
                              hoursPrice,
                              dateTransac.toString()
                          )
                        : { date: "none", value: 0 };

                if (dateNearTransaction.date === "notfound") {
                    let dailyPrice = originalPrices.daily;
                    dateNearTransaction = getPriceWithDaily(
                        dailyPrice,
                        dateTransac.toString()
                    );
                }

                let presentPrice =
                    typeof presentData === "undefined"
                        ? 0
                        : presentData["value"];

                let presentDate =
                    typeof presentData === "undefined"
                        ? 0
                        : presentData["date"];

                Object.assign(transaction, {
                    numberOfTokens: numberOfTokens,
                    pastDate: dateNearTransaction["date"],
                    pastPrice: dateNearTransaction["value"],
                    presentDate: presentDate,
                    presentPrice: presentPrice
                });

                return transaction;
            }
        );
        transactions = await getValueFromPromise(transactions);

        await InvestorModel.updateOne(
            { sharkId: element.sharkId },
            { transactionsHistory: transactions }
        );
    });
};

const getCoinOrTokenDetails = async (coinSymbol) => {
    const coinOrToken = await DBMainCoinModel.findOne({
        symbol: coinSymbol.toLowerCase()
    }).select("coinId name type symbol iconURL cmcRank tagNames usd -_id");

    return coinOrToken || {};
};

const getListCryptosOfShark = async (coins) => {
    if (!coins) return { cryptos: null, totalAssets: "" };

    let cryptosList = Object.keys(coins).map(async (coinSymbol) => {
        const coinDetails = await getCoinOrTokenDetails(
            coinSymbol.toLowerCase()
        );

        let quantity = coins[coinSymbol];
        if (typeof quantity === "object")
            quantity = Number(quantity["$numberLong"]);

        if (Object.keys(coinDetails).length === 0)
            return {
                symbol: coinSymbol,
                quantity: quantity
            };
        else {
            return {
                symbol: coinSymbol,
                quantity: quantity,
                coinId: coinDetails["coinId"],
                name: coinDetails["name"],
                symbol: coinDetails["symbol"],
                type: coinDetails["type"],
                tagNames: coinDetails["tagNames"],
                cmcRank: coinDetails["cmcRank"],
                iconURL: coinDetails["iconURL"],
                price: coinDetails["usd"]["price"],
                total: Math.floor(coinDetails["usd"]["price"] * quantity)
            };
        }
    });

    const cryptos = await getValueFromPromise(cryptosList);

    const totalAssets = cryptos.reduce((current, crypto) => {
        return current + BigInt(crypto.total);
    }, 0n);

    return { cryptos: cryptos, totalAssets: totalAssets.toString() };
};

const calculateInvestorPercent24h = (snapshots) => {
    if (!snapshots) return 0;

    const snapshotsArr1 = Object.entries(snapshots).map((element) => [
        Number(element[0].slice(0, 10)),
        Number(element[1])
    ]);

    const snapshotsArr2 = Object.entries(snapshots).map((element) =>
        Number(element[0].slice(0, 10))
    );

    const max1 = snapshotsArr2.sort((a, b) => b - a)[0];
    const max2 = snapshotsArr2.sort((a, b) => b - a)[1];

    const max1Value = snapshotsArr1.find((a) => a[0] === max1)[1];
    const max2Value = snapshotsArr1.find((a) => a[0] === max2)[1];

    const result = (max1Value / max2Value) * 100;

    return result || 0;
};

// Not done yet
const handleFormatTradeTransactionDataCrawl = async (investor) => {
    let historyDatas = [];
    const sharkWallet = investor._id;
    const symbols = [
        ...new Set(investor.TXs.map((TX) => TX.tokenSymbol.toLowerCase()))
    ];

    symbols.map((symbol) => {
        let historyData = [];

        investor.TXs.forEach((TX) => {
            if (TX.tokenSymbol.toLowerCase() === symbol) {
                const n1 = BigInt(TX.value);
                const n2 = BigInt(
                    Number(Math.pow(10, Number(TX.tokenDecimal)))
                );

                historyData.push({
                    timeStamp: TX.timeStamp,
                    value: "" + Number(BigInt(n1 / n2)),
                    status: sharkWallet === TX.from ? "withdraw" : "deposit"
                });
            }
        });

        historyDatas.push({
            coinSymbol: symbol,
            historyData: historyData
        });
    });

    return historyDatas;
};

// Not done yet
const handleFormatTradeTransactionDataMain = async (investor) => {
    let historyDatas = [];
    const sharkWallet = investor.walletAddress;
    const symbols = [
        ...new Set(
            investor.transactionsHistory.map((transaction) =>
                transaction.tokenSymbol.toLowerCase()
            )
        )
    ];

    symbols.map((symbol) => {
        let historyData = [];

        investor.transactionsHistory.forEach((transaction) => {
            if (transaction.tokenSymbol.toLowerCase() === symbol) {
                const n1 = BigInt(transaction.value);
                const n2 = BigInt(
                    Number(Math.pow(10, Number(transaction.tokenDecimal)))
                );

                historyData.push({
                    timeStamp: transaction.timeStamp,
                    value: "" + Number(BigInt(n1 / n2)),
                    status:
                        sharkWallet === transaction.from
                            ? "withdraw"
                            : "deposit"
                });
            }
        });

        historyDatas.push({
            coinSymbol: symbol,
            historyData: historyData
        });
    });

    return historyDatas;
};

// Not done yet
const handleTradeTransaction = (transactions) => {
    if (!transactions)
        return {
            week: null,
            month: null
        };

    const datas = transactions;

    // 1. WEEK => Thay mảng dates bằng giá trị 7 ngày gần nhất
    let weeks = {};
    let dates = [
        20221119, 20221120, 20221121, 20221122, 20221123, 20221124, 20221125
    ];

    if (datas) {
        Object.keys(datas).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (dates.includes(Math.floor(cv / 1000000))) {
                weeks[key] = datas[`${key}`];
            }
        });
    } else {
        weeks = null;
    }

    // 2. MONTH => Thay 202210 bằng giá trị tháng hiện tại (YYYYmm)
    let months = {};
    if (datas) {
        Object.keys(datas).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (Math.floor(cv / 100000000) == 202211) {
                months[key] = datas[`${key}`];
            }
        });
    } else {
        months = null;
    }

    return {
        week: weeks,
        month: months
    };
};

// Not done yet
const updateInvestorTradeTransaction = async (coinSymbol) => {
    const coin = await DBMainCoinModel.findOne({
        symbol: coinSymbol.toLowerCase()
    }).select("prices -_id");
    const investors = await DBMainInvestorModel.findOne({ sharkId: 1 }).select(
        "historyDatasTest -_id"
    );

    const { week, month, year } = coin.prices;
    const { historyDatasTest } = investors;

    log(week, month, year);
    log(historyDatasTest);
};

// Not done yet
const updateInvestorHistoryDatasTest = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");

    for (let i = 0; i < investors.length; i++) {
        const historyDatasTest = await handleFormatTradeTransactionDataCrawl(
            investors[i]
        );

        await DBMainInvestorModel.findOneAndUpdate(
            { sharkId: i + 1 },
            { historyDatasTest: historyDatasTest }
        )
            .then((data) => {
                if (!data) throw new Error();
            })
            .catch((error) => {
                throw new Error(error);
            });
    }

    log("Update succesfully");
};

const saveInvestorsToFile = async () => {
    const investors = await DBCrawlInvestorModel.find({});

    await fs.writeFileAsync(
        `./databases/DB_Crawl/investors.json`,
        JSON.stringify(investors),
        (error) => {
            if (error) {
                log(`Write file investors.json failed`);
                throw new Error(error);
            }
        }
    );

    log("Write investors into file successfully");
};

const convertInvestorsCollection = async () => {
    // const investors = await DBCrawlInvestorModel.find({});
    const investors = require("../databases/DB_Crawl/investors.json");
    const _ids = require("../databases/DB_Crawl/investors_ids.json");

    let investorList = [];

    for (let i = 0; i < investors.length; i++) {
        const { cryptos, totalAssets } = await getListCryptosOfShark(
            investors[i].coins
        );
        const percent24h = calculateInvestorPercent24h(investors[i].snapshots);

        investorList.push({
            sharkId: i + 1,
            isShark: investors[i].is_shark,
            coins: investors[i].coins,
            transactionsHistory: investors[i].TXs,
            walletAddress: _ids[i]._id,
            followers: [],
            cryptos: cryptos,
            totalAssets: totalAssets,
            percent24h: percent24h || 0,
        });
    }

    return investorList;
};

const saveConvertedInvestorCollectionToFile = async () => {
    const datas = await convertInvestorsCollection();

    await fs.writeFileAsync(
        `./databases/DB_Crawl/investors-converted.json`,
        JSON.stringify(datas),
        (error) => {
            if (error) {
                log(`Write file investors-converted.json failed`);
                throw new Error(error);
            }
        }
    );

    log("Write investors into file successfully");
};

const saveConvertedInvestorCollectionToDB = async () => {
    const investors = require("../databases/DB_Crawl/investors-converted.json");

    for (let i = 0; i < investors.length; i++) {
        try {
            await DBMainInvestorModel.create(investors[i])
                .then((data) => {})
                .catch((error) => {
                    log("Write investor in DB failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Write investor in DB failed");
            throw new Error(error);
        }
    }

    log("Write investors in DB successfully");
};

const updateInvestorsTotalValueInOut = async (sharkId) => {
    const rawData = await InvestorModel.find(
        { "transactionsHistory.500": { $exists: 0 }, isShark: 1 },
        { transactionsHistory: 1, sharkId: 1, walletAddress: 1 }
    );

    await rawData.forEach(async (element) => {
        let totalValueOut = new BigNumber(0);
        let totalValueIn = new BigNumber(0);
        totalValueIn = await element.transactionsHistory.reduce(
            (curr, transaction) => {
                const passValue =
                    transaction.pastPrice === 0 ? 1 : transaction.pastPrice;
                let tmp = curr;

                if (
                    element.walletAddress.toLowerCase() ===
                    transaction.from.toLowerCase()
                )
                    tmp = tmp.plus(transaction.numberOfTokens * passValue);
                else
                    totalValueOut = totalValueOut.plus(
                        transaction.numberOfTokens * passValue
                    );

                return tmp;
            },
            new BigNumber(0)
        );

        await DBMainInvestorModel.updateOne(
            { sharkId: element.sharkId },
            { totalValueIn: totalValueIn, totalValueOut: totalValueOut }
        );
    });

    return 1;
};

const calculateTotalValueInOut = async () => {
    let totalValueOut = new BigNumber(0);
    let totalValueIn = new BigNumber(0);

    totalValueIn = await element.transactionsHistory.reduce(
        (curr, transaction) => {
            const passValue =
                transaction.pastPrice === 0 ? 1 : transaction.pastPrice;
            let tmp = curr;

            if (
                element.walletAddress.toLowerCase() ===
                transaction.from.toLowerCase()
            )
                tmp = tmp.plus(transaction.numberOfTokens * passValue);
            else
                totalValueOut = totalValueOut.plus(
                    transaction.numberOfTokens * passValue
                );

            return tmp;
        },
        new BigNumber(0)
    );

    return { totalValueIn, totalValueOut };
};

const saveCategoriesToFile = async () => {
    const categories = await DBCrawlCategoryModel.find({});

    await fs.writeFileAsync(
        `./databases/DB_Crawl/categories.json`,
        JSON.stringify(categories),
        (error) => {
            if (error) {
                log(`Write file categories.json failed`);
                throw new Error(error);
            }
        }
    );

    log("Write categories into file successfully");
};

const saveCategoriesToDB = async () => {
    // const categories = require(`../databases/DB_Crawl/categories.json`);
    const categories = await DBCrawlCategoryModel.find({});

    for (let i = 0; i < categories.length; i++) {
        try {
            await DBMainTagModel.create({ id: i + 1, name: categories[i].name })
                .then((data) => {})
                .catch((error) => {
                    log("Write category in DB failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Write category in DB failed");
            throw new Error(error);
        }
    }

    log("Write categories in DB successfully");
};

const convertTransactions = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");
    let transactions = [],
        id = 1;

    for (let i = 0; i < investors.length; i++) {
        investors[i].TXs.map((TX) => {
            transactions.push({
                ...TX,
                investorId: i + 1,
                id: id,
                transactionId: id++
            });
        });
    }

    return transactions;
};

const saveConvertedTransactionsToFile = async () => {
    const datas = await convertTransactions();

    await fs.writeFileAsync(
        `./databases/DB_Crawl/transactions-converted.json`,
        JSON.stringify(datas),
        (error) => {
            if (error) {
                log(`Backup file transactions-converted.json error`);
                throw new Error(error);
            }
        }
    );

    log("Write transactions into file successfully");
};

const saveConvertedTransactionsToDB = async () => {
    const transactions = require("../databases/DB_Crawl/transactions-converted.json");

    for (let i = 0; i < transactions.length; i++) {
        try {
            await DBMainTransactionModel.create(transactions[i])
                .then((data) => {})
                .catch((error) => {
                    log("Write transaction in DB failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Write transaction in DB failed");
            throw new Error(error);
        }
    }

    log("Write transactions in DB successfully");
};

const handleDetailChartTransaction = async () => {
    let sharks = [];
    let shark = {};

    investors.forEach((investor) => {
        let historyDatas = [];
        const sharkWallet = investor._id;
        const symbols = [...new Set(investor.TXs.map((TX) => TX.tokenSymbol))];

        symbols.map((symbol) => {
            let historyData = [];

            investor.TXs.forEach((TX) => {
                if (TX.tokenSymbol === symbol) {
                    const n1 = BigInt(TX.value);
                    const n2 = BigInt(
                        Number(Math.pow(10, Number(TX.tokenDecimal)))
                    );

                    historyData.push({
                        timeStamp: TX.timeStamp,
                        value: "" + Number(BigInt(n1 / n2)),
                        status: sharkWallet === TX.from ? "withdraw" : "deposit"
                    });
                }
            });

            historyDatas.push({
                coinSymbol: symbol,
                historyData: historyData
            });
        });

        shark = {
            walletAddress: sharkWallet,
            historyDatas: historyDatas
        };

        sharks.push(shark);
    });

    return sharks;
};

const renameTransactionCollectionField = async () => {
    const transactionLength = await getCollectionLength(DBMainTransactionModel);

    for (let i = 0; i < transactionLength; i++) {
        try {
            await DBMainTransactionModel.updateMany(
                {},
                { $rename: { investorId: "sharkId" } },
                { multi: true }
            )
                .then((data) => {
                    if (!data) throw new Error();
                })
                .catch((error) => {
                    log("Rename transaction field failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Rename transaction field failed");
            throw new Error(error);
        }
    }

    log("Rename transactions field successfully");
};

const removeFieldInMultipleCollection = async () => {
    try {
        await DBMainUserModel.updateMany(
            {},
            { $unset: { accessToken: "", refreshAccessToken: "" } }
        );

        await DBMainAdminModel.updateMany(
            {},
            { $unset: { accessToken: "", refreshAccessToken: "" } }
        );

        log("Remove field in multiple collection successfully");
    } catch (error) {
        log("Remove field in multiple collection failed");
        throw new Error(error);
    }
};

module.exports = {
    dropDBMainCollection,
    handleTokensPrices,
    handleFormatTradeTransactionDataCrawl,
    handleFormatTradeTransactionDataMain,
    handleTradeTransaction,
    updateInvestorTradeTransaction,
    updateInvestorHistoryDatasTest,
    saveInvestorsToFile,
    saveCoinsToFile,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
    getListCryptosOfShark,
    convertInvestorsCollection,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorCollectionToDB,
    updateInvestorsTotalValueInOut,
    saveCategoriesToFile,
    saveCategoriesToDB,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    calculateInvestorPercent24h,
    handleDetailChartTransaction,
    renameTransactionCollectionField,
    removeFieldInMultipleCollection
};
