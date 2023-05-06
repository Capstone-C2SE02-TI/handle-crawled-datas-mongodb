import {
    DBCrawlInvestorModel,
    DBMainInvestorModel,
    DBMainCoinModel
} from "../models/index.js";
import {
    convertUnixTimestampToNumber,
    calculateFirstTransactionDate,
    eToLongStringNumber
} from "../helpers/index.js";
import {
    getCoinOrTokenDetails,
    handleInvestorTransactionHistory,
    getValueFromPromise
} from "./coins.js";
import { fs, log, BigNumber } from "../constants/index.js";
import { getNearest7Days, getThisMonthYear } from "../helpers/index.js";
import _ids from "../databases/DB_Crawl/investors_ids.json" assert { type: "json" };
import investors from "../databases/DB_Crawl/investors.json" assert { type: "json" };
import investorsConverted from "../databases/DB_Crawl/investors-converted.json" assert { type: "json" };

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

const getFollowersOldDatas = async () => {
    // Retrieve docs has followers != []
    const followers = await DBMainInvestorModel.find({
        followers: { $exists: true, $not: { $size: 0 } }
    })
        .select("sharkId followers -_id")
        .lean();

    return followers;
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

const calculateTotalValueInOut = async (transactionsHistory, walletAddress) => {
    let totalValueIn = new BigNumber(0);
    let totalValueOut = new BigNumber(0);

    totalValueIn = await transactionsHistory.reduce((curr, transaction) => {
        const passValue =
            transaction.pastPrice == 0 ? 1 : transaction.pastPrice;
        let tmp = curr;

        if (walletAddress == transaction.from) {
            tmp = tmp.plus(transaction.numberOfTokens * passValue);
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

// [Not done yet]
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

// [Not done yet]
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

// [Not done yet]
const handleTradeTransaction = (transactions) => {
    if (!transactions)
        return {
            week: null,
            month: null
        };

    const datas = transactions;

    // 1. WEEK
    let weeks = {};
    let currentDays = [
        20221119, 20221120, 20221121, 20221122, 20221123, 20221124, 20221125
    ];
    // let currentDays = getNearest7Days();

    if (datas) {
        Object.keys(datas).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (currentDays.includes(Math.floor(cv / 1000000))) {
                weeks[key] = datas[`${key}`];
            }
        });
    } else {
        weeks = null;
    }

    // 2. MONTH => Thay 202210 bằng giá trị tháng hiện tại (YYYYmm)
    let months = {};
    let currentMonthYear = 202212;
    // let currentMonthYear = getThisMonthYear();

    if (datas) {
        Object.keys(datas).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (Math.floor(cv / 100000000) == currentMonthYear) {
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

// [Not done yet]
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

// [Not done yet]
const updateInvestorHistoryDatasTest = async () => {
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
    });

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

const handleUpdateInvestor = (i, investor) => {
    try {
        DBMainInvestorModel.findOneAndUpdate(
            { sharkId: i + 1 },
            {
                isShark: investor.isShark,
                coins: investor.coins,
                transactionsHistory: investor.transactionHistory,
                followers: investor.followers,
                cryptos: investor.cryptos,
                totalAssets: investor.totalAssets,
                percent24h: investor.percent24h || 0,
                totalValueIn: investor.totalValueIn,
                totalValueOut: investor.totalValueOut,
                updateDate: new Date().toString()
            }
        )
            .lean()
            .then(() => log(`Update investor ${i + 1} in DB successfully`))
            .catch((error) => {
                log(`Update investor ${i + 1} in DB failed`);
                throw new Error(error);
            });
    } catch (error) {
        log(`Update investor ${i + 1} in DB failed`);
        throw new Error(error);
    }
};

const handleConvertInvestor = async (start, end, isLog, id6) => {
    const _followers = await getFollowersOldDatas();

    for (let i = start; i < end; i++) {
        const transactionsHistory = await handleInvestorTransactionHistory(
            investors[i]?.TXs || []
        );
        const { cryptos, totalAssets } = await getListCryptosOfShark(
            investors[i]?.coins
        );
        const followers =
            _followers.find((follower) => follower.sharkId == i + 1)
                ?.followers || [];
        const percent24h = calculateInvestorPercent24h(investors[i]?.snapshots);
        const firstTransactionDate =
            calculateFirstTransactionDate(transactionsHistory);
        const { totalValueIn, totalValueOut } = await calculateTotalValueInOut(
            transactionsHistory,
            _ids[i]._id
        );

        const investor = {
            sharkId: i + 1,
            isShark: investors[i]?.is_shark,
            coins: investors[i]?.coins?.[0] || {},
            walletAddress: _ids[i]._id,
            transactionsHistory: transactionsHistory,
            followers: followers,
            cryptos: cryptos,
            totalAssets: totalAssets,
            percent24h: percent24h || 0,
            firstTransactionDate: firstTransactionDate,
            totalValueIn: totalValueIn,
            totalValueOut: totalValueOut
        };

        handleUpdateInvestor(i, investor);

        if (isLog && i == end - 1)
            console.timeEnd(`Time investors-save-db ${id6}`);
    }
};

// 677 sharks
const convertAndSaveInvestorsToDB = async (id6) => {
    for (let i = 0; i < 677; i++) {
        // for (let i = 0; i < investors.length; i++) {
        if (i == investors.length - 1) {
            handleConvertInvestor(i, i + 1, true, id6);
        } else {
            handleConvertInvestor(i, i + 1);
        }
    }
};

const saveConvertedInvestorsToDB = async () => {
    for (let i = 0; i < investorsConverted.length; i++) {
        try {
            await DBMainInvestorModel.create(investorsConverted[i])
                .then()
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

export {
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
};
