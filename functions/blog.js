import { ObjectId, log } from "../constants/index.js";
import { DBMainBlogModel } from "../models/index.js";

export const updateMultipleFieldType = async () => {
    const blog = await DBMainBlogModel.findOne({
        _id: new ObjectId("64325f423f4e558a06a58e24")
    });
    console.log(blog);

    // await DBMainBlogModel.updateMany(
    //     { type: "bao-cao" },
    //     { $set: { type: "baocao" } }
    // );
    // await DBMainBlogModel.updateMany(
    //     { type: "phan-tich" },
    //     { $set: { type: "phantich" } }
    // );
    // await DBMainBlogModel.updateMany(
    //     { type: "quy-dau-tu" },
    //     { $set: { type: "quydautu" } }
    // );
    
    log("Update successfully");
};
