const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const { dbMainConnection } = require("../../configs/connect-database");

const TagSchema = new mongoose.Schema({
    _id: { type: ObjectId },
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
});

const TagModel = dbMainConnection.model("Tag", TagSchema);

module.exports = TagModel;
