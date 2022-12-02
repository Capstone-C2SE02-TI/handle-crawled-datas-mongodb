const investors = [];

const { fs } = require("../constants");
const { log } = require("console");
const { convertUnixTimestampToNumber } = require("../helpers");
const { generateSchemaFromJsonData } = require("./handle");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlTagModel,
    DBMainAdminModel,
    DBMainSharkModel,
    DBMainTagModel,
    DBMainTokenModel,
    DBMainCoinModel,
    DBMainTransactionModel,
    DBMainUserModel
} = require("../models");

const handleTokensPrices = (coinsPrices) => {
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

const convertCoinsCollection = () => {
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
            marketCap: coins[i].market_data?.market_cap?.usd || null
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
    const value = await Promise.all(promiseValue);
    return value;
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

const getListTransactionsOfShark = async (sharkId) => {
    if (!_.isNumber(sharkId)) return -1;

    const rawData = await database
        .collection("sharks")
        .where("id", "==", sharkId)
        .get();

    let transactions = -1;

    rawData.forEach((doc) => {
        transactions = doc
            .data()
            ["transactionsHistory"].map(async (transaction) => {
                let numberOfTokens =
                    transaction["value"] /
                    Math.pow(10, transaction["tokenDecimal"]);
                let hoursPrice = await getHoursPriceOfToken(
                    transaction["tokenSymbol"]
                );

                // found hourly price
                if (typeof hoursPrice !== "undefined") {
                    hoursPrice = Object.keys(hoursPrice).map((unixDate) => {
                        let date = convertUnixTimestampToNumber(
                            unixDate / 1000
                        );
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

                const dateNearTransaction =
                    typeof hoursPrice !== "undefined"
                        ? getDateNearTransaction(
                              hoursPrice,
                              transaction["timeStamp"]
                          )
                        : { date: "none", value: 0 };

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
            });
    });

    transactions = await getValueFromPromise(transactions);

    rawData.forEach((doc) => {
        doc.ref.update({ transactionsHistory: transactions });
    });

    return transactions;
};

const convertInvestorsCollection = () => {
    const investors = require("../databases/DB_Crawl/investors.json");

    let investorList = [];

    for (let i = 0; i < investors.length; i++) {
        investorList.push({
            sharkId: i + 1,
            investorId: i + 1,
            isShark: investors[i].is_shark,
            coins: investors[i].coins,
            contractAddress: investors[i]._id || "",
            followers: []
        });
    }

    return investorList;
};

const saveConvertedInvestorCollectionToFile = async () => {
    const datas = await convertInvestorsCollection();

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

const saveConvertedInvestorCollectionToDB = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");

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

const saveTagCollectionToDB = async () => {
    const tags = require("../databases/DB_Crawl/tags.json");

    for (let i = 0; i < tags.length; i++) {
        try {
            await DBMainTagModel.create({
                id: i + 1,
                tagId: i + 1,
                name: tags[i].name
            })
                .then((data) => {})
                .catch((error) => {
                    log("Write tag in DB failed");
                    throw new Error(error);
                });
        } catch (error) {
            log("Write tag in DB failed");
            throw new Error(error);
        }
    }

    log("Write tags in DB successfully");
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

const generateAndWriteSchemaInFile = async () => {
    const schemas = await generateSchemaFromJsonData(DBCrawlTokensDatas[0]);

    fs.writeFileAsync(
        `./schemas/index.json`,
        JSON.stringify(schemas),
        (error) => {
            if (error) {
                log(`Write file index.js error`);
                throw new Error(error);
            }
        }
    );
};

module.exports = {
    handleTokensPrices,
    convertCoinsCollection,
    saveConvertedCoinCollectionToFile,
    saveConvertedCoinCollectionToDB,
    getListTransactionsOfShark,
    convertInvestorsCollection,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorCollectionToDB,
    saveTagCollectionToDB,
    handleDetailChartTransaction,
    updateSharkHistoryDatas,
    generateAndWriteSchemaInFile
};
