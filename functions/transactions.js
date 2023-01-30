const { fs, log } = require("../constants");
const { DBMainTransactionModel } = require("../models");
const { convertUnixTimestampToNumber } = require("../helpers");

// Ready but not run yet
const _saveConvertedTransactionsToDB = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");
    let id = 1;

    for (let i = 0; i < investors.length; i++) {
        try {
            const investor = require(`../databases/DB_Crawl/investors/investor${
                i + 1
            }.json`);

            investor.transactionHistory.map(async (TX) => {
                await DBMainTransactionModel.create({
                    ...TX,
                    investorId: i + 1,
                    id: id,
                    transactionId: id++
                })
                    .then((data) => {})
                    .catch((error) => {
                        log("Write investor in DB failed");
                        throw new Error(error);
                    });
            });
        } catch (error) {
            log("Write investor in DB failed");
            throw new Error(error);
        }
    }

    log("Write investors in DB successfully");
};

const handleEachTransaction = async ({
    transaction,
    investorId,
    id,
    transactionId
}) => {
    let numberOfTokens =
        Number(transaction["value"]) /
        10 ** Number(transaction["tokenDecimal"]);

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
        presentPrice: presentPrice,
        investorId: investorId,
        id: id,
        transactionId: transactionId
    });

    return transaction;
};

const convertTransactions = async () => {
    const investors = require("../databases/DB_Crawl/investors.json");
    // const investors = require("../databases/DB_Crawl/investors-converted.json");
    let transactionList = [],
        id = 1;

    for (let i = 0; i < investors.length; i++) {
        let promises = await investors[i].TXs.map(async (transaction) => {
            return handleEachTransaction({
                transaction: transaction,
                investorId: i + 1,
                id: id,
                transactionId: id++
            });
        });

        const transactions = await getValueFromPromise(promises);
        transactionList.push(...transactions);

        // transactionList.push({
        //     ...investors[i],
        //     investorId: i + 1,
        //     id: id,
        //     transactionId: id++
        // });
    }

    return transactionList;
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

module.exports = {
    _saveConvertedTransactionsToDB,
    handleEachTransaction,
    convertTransactions,
    saveConvertedTransactionsToFile,
    saveConvertedTransactionsToDB,
    handleDetailChartTransaction
};
