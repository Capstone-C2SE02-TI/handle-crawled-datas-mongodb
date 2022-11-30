const mongoose = require("mongoose");
const { dbMainConnection } = require("../../configs/connect-database");

const TagSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        }
    },
    { versionKey: false }
);

const TagModel = dbMainConnection.model("Tag", TagSchema);

module.exports = TagModel;
