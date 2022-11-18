const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_MAIN_URI, MONGODB_CRAWL_URI } = process.env;

const dbCrawlConnection = mongoose.createConnection(MONGODB_CRAWL_URI);
const dbMainConnection = mongoose.createConnection(MONGODB_MAIN_URI);

module.exports = { dbCrawlConnection, dbMainConnection };
