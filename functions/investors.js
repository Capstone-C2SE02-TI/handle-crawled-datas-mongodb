const { fs, log, BigNumber } = require("../constants");
const {
    DBCrawlInvestorModel,
    DBMainInvestorModel,
    DBMainCoinModel,
} = require("../models");
const {
    convertUnixTimestampToNumber,
    calculateFirstTransactionDate,
    eToLongStringNumber
} = require("../helpers");

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
                total: Math.floor(coinDetails["usd"]["price"] * quantity) || 0
            };
        }
    });

    const cryptos = await getValueFromPromise(cryptosList);

    const totalAssets = cryptos.reduce((current, crypto) => {
        return current + BigInt(crypto?.total || 0) || "0";
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
    })
        .select("prices -_id")
        .lean();
    const investors = await DBMainInvestorModel.findOne({ sharkId: 1 })
        .select("historyDatasTest -_id")
        .lean();

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
            .lean()
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
    const investors = await DBCrawlInvestorModel.find({
        is_shark: true
    }).lean();

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

const convertInvestorsCollection = async (id5) => {
    const investors = require("../databases/DB_Crawl/investors.json");
    const _ids = require("../databases/DB_Crawl/investors_ids.json");
    const _followers = await getFollowersOldDatas();
    let investorList = [];

    const writeInvestor = async (index, datas) => {
        await fs.writeFileAsync(
            `./databases/DB_Crawl/investors/investor${index + 1}.json`,
            // `./databases/DB_Crawl/investors-converted.json`,
            JSON.stringify(datas),
            (error) => {
                if (error) {
                    log(`Write file investors${index + 1}.json failed`);
                    throw new Error(error);
                }
            }
        );
    };

    const handleConvertInvestor = async (start, end, isLog) => {
        for (let i = start; i < end; i++) {
            const transactionHistory = await handleInvestorTransactionHistory(
                investors[i].TXs
            );
            const { cryptos, totalAssets } = await getListCryptosOfShark(
                investors[i].coins[0]
            );
            const followers =
                _followers.find((follower) => follower.sharkId == i + 1)
                    ?.followers || [];
            const percent24h = calculateInvestorPercent24h(
                investors[i].snapshots
            );
            const firstTransactionDate =
                calculateFirstTransactionDate(transactionHistory);
            const { totalValueIn, totalValueOut } =
                await calculateTotalValueInOut(transactionHistory, _ids[i]._id);

            const investorInfo = {
                sharkId: i + 1,
                isShark: investors[i].is_shark,
                coins: investors[i].coins[0],
                walletAddress: _ids[i]._id,
                transactionsHistory: transactionHistory,
                followers: followers,
                cryptos: cryptos,
                totalAssets: totalAssets,
                percent24h: percent24h || 0,
                firstTransactionDate: firstTransactionDate,
                totalValueIn: totalValueIn,
                totalValueOut: totalValueOut
            };
            log(`Handle investor ${i + 1} ...`);
            writeInvestor(i, investorInfo);

            if (isLog && i == end - 1)
                console.timeEnd(`Execute_time investors-save-db ${id5}`);
        }
    };

    // let len = investors.length,
    //     limit = Math.floor(len / 10),
    //     jump = 10,
    //     start = 0,
    //     end = start + jump;

    // for (let i = 0; i < limit; i++) {
    //     setTimeout(() => {
    //         if (i == limit - 1) handleConvertInvestor(start, len, true);
    //         else handleConvertInvestor(start, end);

    //         start = start + jump;
    //         end = start + jump;
    //     }, 0);
    // }

    for (let i = 0; i < investors.length / 10; i++) {
        // setTimeout(() => {
        if (i == investors.length - 1) handleConvertInvestor(i, i + 1, true);
        else handleConvertInvestor(i, i + 1, false);
        // }, 0);
    }

    return investorList;
};

const saveConvertedInvestorCollectionToFile = async () => {
    await convertInvestorsCollection();
    log("Write investors into file successfully");
};

const saveConvertedInvestorsToDB = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");

    for (let i = 0; i < investors.length; i++) {
        try {
            const investor = require(`../databases/DB_Crawl/investors/investor${
                i + 1
            }.json`);

            await DBMainInvestorModel.create(investor)
                .lean()
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

const saveConvertedInvestorCollectionToDB = async () => {
    const investors = require("../databases/DB_Crawl/investors-converted.json");

    for (let i = 0; i < investors.length; i++) {
        try {
            await DBMainInvestorModel.create(investors[i])
                .lean()
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

const calculateTotalValueInOut = async (transactionsHistory, walletAddress) => {
    let totalValueIn = new BigNumber(0);
    let totalValueOut = new BigNumber(0);

    totalValueIn = await transactionsHistory.reduce((curr, transaction) => {
        const passValue =
            transaction.pastPrice == 0 ? 1 : transaction.pastPrice;
        let tmp = curr;

        // log(
        //     "walletAddress",
        //     walletAddress,
        //     "/ntransaction.from",
        //     transaction.from
        // );

        if (walletAddress == transaction.from) {
            tmp = tmp.plus(transaction.numberOfTokens * passValue);
            // log("=");
            // log("tmp", tmp);
        } else {
            totalValueOut = totalValueOut.plus(
                transaction.numberOfTokens * passValue
            );
        }

        return tmp;
    }, new BigNumber(0));

    return {
        totalValueIn: eToLongStringNumber(totalValueIn),
        totalValueOut: eToLongStringNumber(totalValueOut)
    };
};

const updateInvestorTransactionsHistoryTotalValueFirstTrans = async () => {
    for (let i = 1; i <= 683; i++) {
        const investor = await DBMainInvestorModel.findOne({
            sharkId: i
        })
            .select("transactionsHistory walletAddress")
            .lean();

        const transactionsHistory = await handleInvestorTransactionHistory(
            investor.transactionsHistory
        );
        const { totalValueIn, totalValueOut } = await calculateTotalValueInOut(
            transactionsHistory,
            investor.walletAddress
        );
        const firstTransactionDate =
            calculateFirstTransactionDate(transactionsHistory);

        try {
            await DBMainInvestorModel.findOneAndUpdate(
                { sharkId: i },
                {
                    $set: {
                        transactionsHistory: transactionsHistory,
                        totalValueIn: totalValueIn,
                        totalValueOut: totalValueOut,
                        firstTransactionDate: firstTransactionDate
                    }
                }
            ).lean();

            log(`Successfully ${i}`);
        } catch (error) {
            log(`Failed ${i}`);
            throw new Error(error);
        }
    }
};

const getFollowersOldDatas = async () => {
    // Chỉ lấy ra những docs có field followers != []
    const followers = await DBMainInvestorModel.find({
        followers: { $exists: true, $not: { $size: 0 } }
    })
        .select("sharkId followers -_id")
        .lean();

    return followers;
};

module.exports = {
    getListCryptosOfShark,
    calculateInvestorPercent24h,
    handleFormatTradeTransactionDataCrawl,
    handleFormatTradeTransactionDataMain,
    handleTradeTransaction,
    updateInvestorTradeTransaction,
    updateInvestorHistoryDatasTest,
    saveInvestorsToFile,
    convertInvestorsCollection,
    saveConvertedInvestorCollectionToFile,
    saveConvertedInvestorsToDB,
    saveConvertedInvestorCollectionToDB,
    calculateTotalValueInOut,
    updateInvestorTransactionsHistoryTotalValueFirstTrans,
    getFollowersOldDatas
};
