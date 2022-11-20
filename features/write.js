const database = "";

const DB1 = []; // require("../db1.json");
const DB2 = [];
const DB3 = [];
const datas = []; // require("../db/db.json");
const metadata = []; // require("../db/metadata.json");
const sharksDatas = []; // require("../db/db_sharks.json");
const tokensDatas = []; // require("../db/db_tokens.json");
const tagsDatas = []; // require("../db/db_tags.json");
const sharksDB = []; // require("../sharks.json");
const investors = []; // require("../investors.json");

const { convertUnixTimestampToNumber } = require("../helpers");
const { generateSchemaFromJsonData } = require("./handle");
const {
    DBCrawlCoinModel,
    DBCrawlInvestorModel,
    DBCrawlMetadataModel,
    DBCrawlTagModel,
    DBCrawlTokenModel,
    DBMainAdminModel,
    DBMainSharkModel,
    DBMainTagModel,
    DBMainTokenModel,
    DBMainTransactionModel,
    DBMainUserModel
} = require("../models");

const updateTokensPrices = async () => {
    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .startAt(1)
        .limit(10)
        .get();

    let id = 0;

    tokens.forEach((doc) => {
        // doc.ref.update({ prices: FieldValue.delete() });
        doc.ref.update({ prices: DB3[id++].prices });
    });
};

const updateTokensPriceLast1Day = async () => {
    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .startAt(1)
        .limit(10)
        .get();

    let id = 0;

    tokens.forEach((doc) => {
        // doc.ref.update({ prices: FieldValue.delete() });
        doc.ref.update({ prices: DB2[id++].prices });
    });
};

const updateMetadata = async () => {
    let prices = [];

    metadata.forEach(async (data) => {
        if (Object.entries(data.prices).length !== 0) {
            prices.push({
                id: data.id,
                name: data.name,
                prices: data.prices
            });
        }
    });

    return prices;
};

const writeCoinsInDB = async () => {
    datas.forEach(async (data) => {
        const docId = randomFirestoreDocumentId();
        await database.collection("tokens").doc(docId).set(data);
    });
};

const writeUsersInDB = async () => {
    DB1.forEach(async (data) => {
        const docId = randomFirestoreDocumentId();
        await database.collection("users").doc(docId).set(data);
    });
};

const writeSharksInDB = async () => {
    sharksDatas.forEach(async (data) => {
        const docId = randomFirestoreDocumentId();
        await database.collection("sharks").doc(docId).set(data);
    });
};

const writeTagsInDB = async () => {
    tagsDatas.forEach(async (data) => {
        const docId = randomFirestoreDocumentId();
        await database.collection("tags").doc(docId).set(data);
    });
};

const reduceTokensInDB = async () => {
    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .startAt(61)
        .limit(48)
        .get();

    tokens.forEach((token) => {
        token.ref.delete();
    });
};

const updateTokensID = async () => {
    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .get();

    tokens.forEach((doc) => {
        doc.ref.update({ id: doc.get("id") + 10 });
    });
};

const updateTokensDailyPrice = async () => {
    const tokens = await database
        .collection("tokens")
        // .where("name", "==", "Bitcoin")
        .where("name", "==", "Ethereum")
        .get();

    tokens.forEach((doc) => {
        doc.ref.update({ price: datas[0] });
    });
};

const updateSharksFields = async () => {
    const sharks = await database
        .collection("sharks")
        .orderBy("id", "asc")
        .get();

    let id = 0;

    sharks.forEach((doc) => {
        doc.ref.update({
            historyDatas: sharksDB[id++].historyDatas
        });
    });
};

const updateCoinId = async () => {
    // let ethIds = [
    //     825, 3408, 4943, 5994, 3717, 3957, 7083, 1975, 3635, 18876, 1966, 4066,
    //     6210, 3155, 7278, 6783, 2563, 3330, 3897, 6719, 19891, 2502, 1518, 2586,
    //     5068, 8000, 6538, 4705, 2694, 2130, 1697, 4269, 1934, 8642, 4846, 5692,
    //     2700, 2682, 8104, 1659, 9444, 5864, 7080, 3783, 9903, 7653, 1455, 3306,
    //     13855, 5728, 11584, 1808, 3964, 1896, 3640, 6945, 2496, 1772, 7455,
    //     1817,
    // ];

    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .startAt(11)
        .limit(60)
        .get();

    let id = 0;

    tokens.forEach((doc) => {
        doc.ref.update(tokensDatas[id++]);
    });
};

const removeDocumentField = async () => {
    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .get();

    // tokens.forEach((doc) => {
    //     doc.ref.update({
    //         tagGroups: FieldValue.delete(),
    //         tags: FieldValue.delete(),
    //         category: FieldValue.delete(),
    //         selfReportedCirculatingSupply: FieldValue.delete(),
    //         selfReportedMarketCap: FieldValue.delete(),
    //         selfReportedTags: FieldValue.delete(),
    //         description: FieldValue.delete(),
    //     });
    // });
};

const updateTagNames = async () => {
    const tokens = await database
        .collection("tokens")
        .orderBy("id", "asc")
        .get();

    let tagsNames = [];

    tokens.forEach((doc) => {
        tagsNames = [...tagsNames, doc.data().tagNames];
    });

    return tagsNames;
};

const handleTokensPrices = async () => {
    let prices = [];

    for (let i = 0; i < 10; i++) {
        // 1. DAY
        let days = {};

        // [Need Handle] Thay 20221009 bằng ngày hiện tại
        Object.keys(metadata[i].prices.hourly).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));

            if (Math.floor(cv / 1000000) == 20221009) {
                days[key] = metadata[i].prices.hourly[`${key}`];
            }
        });

        // 2. WEEK
        let weeks = {};

        // [Need Handle] Thay mảng dates bằng giá trị 7 ngày gần nhất
        let dates = [
            20221009, 20221008, 20221007, 20221006, 20221005, 20221004, 20221003
        ];

        Object.keys(metadata[i].prices.daily).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (dates.includes(Math.floor(cv / 1000000))) {
                weeks[key] = metadata[i].prices.daily[`${key}`];
            }
        });

        // 3. MONTH
        let months = {};

        // [Need Handle] Thay 202209 bằng giá trị tháng hiện tại (YYYYmm)
        Object.keys(metadata[i].prices.daily).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (Math.floor(cv / 100000000) == 202209) {
                months[key] = metadata[i].prices.daily[`${key}`];
            }
        });

        // 4. YEAR
        let years = {};

        // [Need Handle] Thay monthYears bằng giá trị 12 gần nhất kể cả trừ tháng hiện tại
        const monthYears = [
            202110, 202111, 202112, 202201, 202202, 202203, 202204, 202205,
            202206, 202207, 202208, 202209
        ];

        Object.keys(metadata[i].prices.daily).forEach((key) => {
            const cv = convertUnixTimestampToNumber(key.slice(0, 10));
            if (monthYears.includes(Math.floor(cv / 100000000))) {
                years[key] = metadata[i].prices.daily[`${key}`];
            }
        });

        // UPDATE DATA
        prices.push({
            prices: {
                day: days,
                week: weeks,
                month: months,
                year: years
            }
        });
    }

    return prices;
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
            await SharkModel.findOneAndUpdate(
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
    writeCoinsInDB,
    writeUsersInDB,
    writeSharksInDB,
    writeTagsInDB,
    reduceTokensInDB,
    updateTokensID,
    updateTokensDailyPrice,
    updateSharksFields,
    removeDocumentField,
    updateCoinId,
    updateTagNames,
    updateMetadata,
    updateTokensPriceLast1Day,
    updateTokensPrices,
    handleTokensPrices,
    handleDetailChartTransaction,
    updateSharkHistoryDatas,
    generateAndWriteSchemaInFile
};
