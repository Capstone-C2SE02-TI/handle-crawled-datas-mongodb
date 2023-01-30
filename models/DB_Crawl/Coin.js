const mongoose = require("mongoose");
const { dbCrawlConnection } = require("../../configs/connectDatabase");

const CoinSchema = new mongoose.Schema({
    // price: {
    //     daily: {
    //         type: "Object"
    //     },
    //     hourly: {
    //         type: "Object"
    //     }
    // },
    // name: {
    //     type: "String"
    // },
    // total_supply: {
    //     type: "Number"
    // },
    // platform: {
    //     type: "Mixed"
    // },
    // is_market_cap_included_in_calc: {
    //     type: "Number"
    // },
    // tvl_ratio: {
    //     type: "Mixed"
    // },
    // tags: {
    //     type: ["String"]
    // },
    // TXs: {
    //     type: "Array"
    // },
    // date_added: {
    //     type: "Date"
    // },
    // id: {
    //     type: "Number"
    // },
    // max_supply: {
    //     type: "Number"
    // },
    // self_reported_circulating_supply: {
    //     type: "Mixed"
    // },
    // last_updated: {
    //     type: "Date"
    // },
    // circulating_supply: {
    //     type: "Number"
    // },
    // self_reported_market_cap: {
    //     type: "Mixed"
    // },
    // quote: {
    //     USD: {
    //         price: {
    //             type: "Number"
    //         },
    //         volume_24h: {
    //             type: "Number"
    //         },
    //         volume_24h_reported: {
    //             type: "Number"
    //         },
    //         volume_7d: {
    //             type: "Number"
    //         },
    //         volume_7d_reported: {
    //             type: "Number"
    //         },
    //         volume_30d: {
    //             type: "Number"
    //         },
    //         volume_30d_reported: {
    //             type: "Number"
    //         },
    //         volume_change_24h: {
    //             type: "Number"
    //         },
    //         percent_change_1h: {
    //             type: "Number"
    //         },
    //         percent_change_24h: {
    //             type: "Number"
    //         },
    //         percent_change_7d: {
    //             type: "Number"
    //         },
    //         percent_change_30d: {
    //             type: "Number"
    //         },
    //         percent_change_60d: {
    //             type: "Number"
    //         },
    //         percent_change_90d: {
    //             type: "Number"
    //         },
    //         market_cap: {
    //             type: "Number"
    //         },
    //         market_cap_dominance: {
    //             type: "Number"
    //         },
    //         fully_diluted_market_cap: {
    //             type: "Number"
    //         },
    //         tvl: {
    //             type: "Mixed"
    //         },
    //         last_updated: {
    //             type: "Date"
    //         }
    //     }
    // },
    // num_market_pairs: {
    //     type: "Number"
    // },
    // cmc_rank: {
    //     type: "Number"
    // },
    // symbol: {
    //     type: "String"
    // },
    // slug: {
    //     type: "String"
    // }
});

const CoinModel = dbCrawlConnection.model("Coin", CoinSchema);

module.exports = CoinModel;
