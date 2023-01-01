const mongoose = require("mongoose");
const { dbMainConnection } = require("../../configs/connect-database");

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

module.exports = TagModel;
