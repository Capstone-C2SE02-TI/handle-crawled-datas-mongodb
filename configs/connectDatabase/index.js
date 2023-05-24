import mongoose, { createConnection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// mongoose.set("bufferCommands", false);

const { MONGODB_CRAWL_URI, MONGODB_MAIN_URI } = process.env;

export const dbCrawlConnection = createConnection(MONGODB_CRAWL_URI);
export const dbMainConnection = createConnection(MONGODB_MAIN_URI);
