const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_MAIN_URI, MONGODB_CRAWL_URI } = process.env;

const connectDatabase = () => {
    try {
        mongoose.connect(MONGODB_MAIN_URI, { useNewUrlParser: true });

        mongoose.connection.on("error", (error) => {
            console.log("Connect to database failed with error:", error);
            throw new Error(error);
        });

        mongoose.connection.on("open", () => {
            console.log("Connect to database successfully");
        });
    } catch (error) {
        console.log("Connect to database failed with error:", error);
        throw new Error(error);
    }
};

module.exports = { connectDatabase };

// var connection1 = mongoose.createConnection("");
// var connection2 = mongoose.createConnection("");

// var ModelA = connection1.model(
//     "Model", ModelSchema
// );

// var ModelB = connection2.model(
//     "Model", ModelSchema
// );
