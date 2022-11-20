const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { dbCrawlConnection } = require("../../configs/connect-database");

const MetadataSchema = new mongoose.Schema({
    // id: {
    //     type: "Number"
    // },
    // name: {
    //     type: "String"
    // },
    // symbol: {
    //     type: "String"
    // },
    // category: {
    //     type: "String"
    // },
    // description: {
    //     type: "String"
    // },
    // slug: {
    //     type: "String"
    // },
    // logo: {
    //     type: "String"
    // },
    // subreddit: {
    //     type: "String"
    // },
    // notice: {
    //     type: "String"
    // },
    // tags: {
    //     type: "String"
    // },
    // urls: {
    //     website: {
    //         type: "String"
    //     },
    //     twitter: {
    //         type: "String"
    //     },
    //     message_board: {
    //         type: "String"
    //     },
    //     chat: {
    //         type: "String"
    //     },
    //     facebook: {
    //         type: "Array"
    //     },
    //     explorer: {
    //         type: "String"
    //     },
    //     reddit: {
    //         type: "Array"
    //     },
    //     technical_doc: {
    //         type: "Array"
    //     },
    //     source_code: {
    //         type: "String"
    //     },
    //     announcement: {
    //         type: "String"
    //     }
    // },
    // platform: {
    //     id: {
    //         type: "Date"
    //     },
    //     name: {
    //         type: "String"
    //     },
    //     slug: {
    //         type: "String"
    //     },
    //     symbol: {
    //         type: "String"
    //     },
    //     token_address: {
    //         type: "String"
    //     }
    // },
    // date_added: {
    //     type: "Date"
    // },
    // twitter_username: {
    //     type: "String"
    // },
    // is_hidden: {
    //     type: "Number"
    // },
    // date_launched: {
    //     type: "Mixed"
    // },
    // contract_address: {
    //     type: "Mixed"
    // },
    // self_reported_circulating_supply: {
    //     type: "Mixed"
    // },
    // self_reported_tags: {
    //     type: "Mixed"
    // },
    // self_reported_market_cap: {
    //     type: "Mixed"
    // },
    // status: {
    //     type: "String"
    // },
    // tagGroups: {
    //     type: "String"
    // },
    // tagNames: {
    //     type: "String"
    // },
    // image: {
    //     png: {
    //         type: "Number"
    //     }
    // },
    // decimal: {
    //     type: "Number"
    // }
});

const MetadataModel = dbCrawlConnection.model("Metadata", MetadataSchema);

module.exports = MetadataModel;
