import mongoose from "mongoose";
import { dbMainConnection } from "../../configs/connectDatabase/index.js";

const TagSchema = new mongoose.Schema(
    {
        id: {
            type: Number
        },
        name: {
            type: String,
            trim: true
        },
        updateDate: {
            type: String,
            default: new Date().toString()
        }
    },
    { versionKey: false }
);

const TagModel = dbMainConnection.model("Tag", TagSchema);

export default TagModel;
