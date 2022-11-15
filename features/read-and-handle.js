const database = require("../configs/connect-database");
const { convertUnixTimestampToNumber } = require("../helpers");

const getListOfCoins = async () => {
    let id = 1;
    let coinsList = [];

    let coins = await database
        .collection("coins")
        .orderBy("cmc_rank", "asc")
        .get();

    coins.forEach((doc) => {
        const data = doc.data();

        const resultData = {
            id: id++,
            ethId: data.id,
            name: data.name,
            symbol: data.symbol,
            iconURL: data.iconURL,
            usd: {
                price: data.quote.USD.price,
                percentChange24h: data.quote.USD.percent_change_24h,
                percentChange7d: data.quote.USD.percent_change_7d,
                volume24h: data.quote.USD.volume_24h,
            },
            marketCap: data.quote.USD.market_cap,
            circulatingSupply: data.circulating_supply,
        };

        coinsList.push(resultData);
    });

    return coinsList;
};

const getListOfTokens = async () => {
    let tokensList = [];
    let tokens = await database
        .collection("coins")
        .where("name", "==", "Bitcoin")
        // .where("name", "==", "Ethereum")
        .get();

    tokens.forEach((doc) => {
        // const resultData = {};
        const resultData = [];
        const dates = [
            20220930, 20220929, 20220928, 20220927, 20220926, 20220925,
            20220924,
        ];

        const prices = doc.data().price.daily;
        const priceKeys = Object.keys(prices);

        priceKeys.map((priceKey) => {
            const dmyDay = Math.floor(
                convertUnixTimestampToNumber(Number(priceKey) / 1000) / 1000000,
            );

            resultData.push(dmyDay);

            // if (dates.includes(dmyDay)) {
            //     // resultData[priceKey] = prices[priceKey];
            //     resultData.push(prices[priceKey]);
            // }
        });

        tokensList.push(resultData);
    });

    return tokensList;
};

const exportCollection = async (collectionName) => {
    let datasList = [];
    let datas = await database
        .collection(collectionName)
        .orderBy("id", "asc")
        .get();

    datas.forEach((doc) => {
        const data = doc.data();
        datasList.push(data);
    });

    return datasList;
};

module.exports = { getListOfCoins, getListOfTokens, exportCollection };
