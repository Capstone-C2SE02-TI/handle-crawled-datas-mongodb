const metadata = [];
const investors = [];

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
    handleTokensPrices,
    handleDetailChartTransaction,
    updateSharkHistoryDatas,
    generateAndWriteSchemaInFile
};
