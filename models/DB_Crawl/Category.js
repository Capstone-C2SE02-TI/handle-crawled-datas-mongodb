const mongoose = require("mongoose");
const { dbCrawlConnection } = require("../../configs/connectDatabase");

const CategorySchema = new mongoose.Schema({
    // _id: {
    //     type: "ObjectId"
    // },
    // name: {
    //     type: "String"
    // }
});

const CategoryModel = dbCrawlConnection.model("Category", CategorySchema);

module.exports = CategoryModel;
