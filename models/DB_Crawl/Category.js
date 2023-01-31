import mongoose from "mongoose";
import { dbCrawlConnection } from "../../configs/connectDatabase/index.js";

const CategorySchema = new mongoose.Schema({
    // _id: {
    //     type: "ObjectId"
    // },
    // name: {
    //     type: "String"
    // }
});

const CategoryModel = dbCrawlConnection.model("Category", CategorySchema);

export default CategoryModel;
