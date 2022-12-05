const { fs, log } = require("../constants");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlCategoryModel,
    DBMainAdminModel,
    DBMainSharkModel,
    DBMainInvestorModel,
    DBMainTagModel,
    DBMainTokenModel,
    DBMainCoinModel,
    DBMainTransactionModel,
    DBMainUserModel
} = require("../models");
const { getCollectionLength } = require("./read");
const { convertUnixTimestampToNumber } = require("../helpers");

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

const convertCoinsCollection = async () => {
    const coins = await DBCrawlCoinModel.find({});
    // const ids = await DBCrawlCoinModel.find({}).select("_id");

    // const coins = require("../databases/DB_Crawl/coins.json");
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

    return positionDate === null
        ? {
              date: "none",
              value: 0
          }
        : positionDate === dateList.length - 1
        ? dateList[dateList.length - 1]
        : dateList[positionDate + 1];
};

// Hàm ni đang viết Hiếu nghe, chỉ xử lí cho 1 shark thôi. Chứ ko all shark
const getListTransactionsOfInvestor = async (transactionsHistory) => {
    let transactions = transactionsHistory.map(async (transaction) => {
        let numberOfTokens =
            transaction["value"] / Math.pow(10, transaction["tokenDecimal"]);
        let hoursPrice = await getHoursPriceOfToken(transaction["tokenSymbol"]);

        if (
            typeof hoursPrice !== "undefined" &&
            Boolean(hoursPrice) !== false
        ) {
            hoursPrice = Object.keys(hoursPrice).map((unixDate) => {
                let date = convertUnixTimestampToNumber(unixDate / 1000);
                date = date.toString();
                return {
                    date: date,
                    value: hoursPrice[unixDate]
                };
            });

            hoursPrice.sort(
                (firstObj, secondObj) => secondObj["date"] - firstObj["date"]
            );
        } else {
            return {
                numberOfTokens: numberOfTokens,
                pastDate: null,
                pastPrice: null,
                presentDate: null,
                presentPrice: null
            };
        }

        let presentData =
            typeof hoursPrice !== "undefined" ? hoursPrice[0] : undefined;

        const dateNearTransaction =
            typeof hoursPrice !== "undefined"
                ? getDateNearTransaction(hoursPrice, transaction["timeStamp"])
                : { date: "none", value: 0 };

        let presentPrice =
            typeof presentData === "undefined" ? 0 : presentData["value"];

        let presentDate =
            typeof presentData === "undefined" ? 0 : presentData["date"];

        return {
            numberOfTokens: numberOfTokens,
            pastDate: dateNearTransaction["date"],
            pastPrice: dateNearTransaction["value"],
            presentDate: presentDate,
            presentPrice: presentPrice
        };
    });

    return await getValueFromPromise(transactions);
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

const updateInvestorTradeTransaction = async (coinSymbol) => {
    const coin = await DBMainCoinModel.findOne({
        symbol: coinSymbol.toLowerCase()
    }).select("prices -_id");

    const { week, month, year } = coin.prices;
    log(week, month, year);
};

const updateInvestorHistoryDatasTest = async () => {
    // const investors = await DBMainInvestorModel.find({}).select(
    //     "transactionsHistory -_id"
    // );
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
};

const saveInvestorsToFile = async () => {
    const datas = await DBCrawlInvestorModel.find({});

    await fs.writeFileAsync(
        `./databases/DB_Crawl/investors.json`,
        JSON.stringify(datas),
        (error) => {
            if (error) {
                log(`Backup file investors.json error`);
                throw new Error(error);
            }
        }
    );

    log("Write investors into file successfully");
};

const convertInvestorsCollection = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");
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
            walletAddress: investors[i]._id || "",
            followers: [],
            cryptos: cryptos,
            totalAssets: totalAssets,
            percent24h: percent24h || 0
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
                log(`Backup file investors-converted.json error`);
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

const saveCategoriesToFile = async () => {
    const datas = await DBCrawlCategoryModel.find({});

    await fs.writeFileAsync(
        `./databases/DB_Crawl/categories-converted.json`,
        JSON.stringify(datas),
        (error) => {
            if (error) {
                log(`Write file categories-converted.json error`);
                throw new Error(error);
            }
        }
    );

    log("Write categories into file successfully");
};

const saveCategoriesToDB = async () => {
    const categories = require("../databases/DB_Crawl/categories-converted.json");

    for (let i = 0; i < categories.length; i++) {
        try {
            await DBMainTagModel.create({ id: i + 1, ...categories[i] })
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
                transactionId: id++
            });
        });
    }

    // Sort descending follow timestamp ?

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

const updateSharkHistoryDatas = async () => {
    const sharksDB = require("./sharks.json");

    for (let i = 0; i <= 9; i++) {
        try {
            await DBMainSharkModel.findOneAndUpdate(
                { id: i + 1 },
                { historyDatas: sharksDB[i].historyDatas }
            )
                .then((data) => {
                    if (!data) throw new Error();
                })
                .catch((error) => {
                    throw new Error(error);
                });

            return true;
        } catch (error) {
            return false;
        }
    }
};

const addTransactionCollectionId = async () => {
    const transactionLength = await getCollectionLength(DBMainTransactionModel);

    for (let i = 0; i < transactionLength; i++) {
        try {
            await DBMainTransactionModel.findOneAndUpdate(
                { transactionId: i + 1 },
                { id: i + 1 }
            )
                .then((data) => {
                    if (!data) throw new Error();
                })
                .catch((error) => {
                    log("Update Transaction id failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Update Transaction id failed");
            throw new Error(error);
        }
    }

    log("Update Transactions id successfully");
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
                    log("Rename Transaction field failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Rename Transaction field failed");
            throw new Error(error);
        }
    }

    log("Rename Transactions field successfully");
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
    handleTokensPrices,
    handleFormatTradeTransactionDataCrawl,
    handleFormatTradeTransactionDataMain,
    handleTradeTransaction,
    updateInvestorTradeTransaction,
    updateInvestorHistoryDatasTest,
    saveInvestorsToFile,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
    getListTransactionsOfInvestor,
    getListCryptosOfShark,
    convertInvestorsCollection,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorCollectionToDB,
    saveCategoriesToFile,
    saveCategoriesToDB,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    calculateInvestorPercent24h,
    handleDetailChartTransaction,
    updateSharkHistoryDatas,
    addTransactionCollectionId,
    renameTransactionCollectionField,
    removeFieldInMultipleCollection
};
