const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { dbCrawlConnection } = require("../../configs/connect-database");

const TokenSchema = new mongoose.Schema({
    // total_supply: {
    //     type: "Number"
    // },
    // id: {
    //     type: "Number"
    // },
    // platform: {
    //     id: {
    //         type: "Number"
    //     },
    //     name: {
    //         type: "String"
    //     },
    //     symbol: {
    //         type: "String"
    //     },
    //     slug: {
    //         type: "String"
    //     },
    //     token_address: {
    //         type: "String"
    //     }
    // },
    // self_reported_market_cap: {
    //     type: "Mixed"
    // },
    // iconURL: {
    //     type: "String"
    // },
    // symbol: {
    //     type: "String"
    // },
    // tags: {
    //     type: "String"
    // },
    // cmc_rank: {
    //     type: "Number"
    // },
    // date_added: {
    //     type: "Date"
    // },
    // self_reported_circulating_supply: {
    //     type: "Mixed"
    // },
    // slug: {
    //     type: "String"
    // },
    // quote: {
    //     USD: {
    //         price: {
    //             type: "Number"
    //         },
    //         volume_24h: {
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
    // max_supply: {
    //     type: "Mixed"
    // },
    // TXs: {
    //     type: "Array"
    // },
    // last_updated: {
    //     type: "Date"
    // },
    // circulating_supply: {
    //     type: "Number"
    // },
    // num_market_pairs: {
    //     type: "Number"
    // },
    // is_market_cap_included_in_calc: {
    //     type: "Number"
    // },
    // tvl_ratio: {
    //     type: "Mixed"
    // },
    // name: {
    //     type: "String"
    // },
    // decimal: {
    //     type: "Number"
    // }
});

const TokenModel = dbCrawlConnection.model("Token", TokenSchema);

module.exports = TokenModel;
