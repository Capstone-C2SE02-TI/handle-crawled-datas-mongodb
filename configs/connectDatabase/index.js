import { createConnection } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { MONGODB_MAIN_URI, MONGODB_CRAWL_URI } = process.env;

const dbCrawlConnection = createConnection(MONGODB_CRAWL_URI);
const dbMainConnection = createConnection(MONGODB_MAIN_URI);

export { dbCrawlConnection, dbMainConnection };
