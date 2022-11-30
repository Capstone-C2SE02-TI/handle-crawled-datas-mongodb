const mongoose = require("mongoose");
const { dbMainConnection } = require("../../configs/connect-database");

const AdminSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            minlength: 16,
            maxlength: 40
        },
        username: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            minLength: 5,
            maxlength: 16
        },
        password: {
            type: String,
            trim: true,
            required: true
        },
        accessToken: {
            type: String,
            default: ""
        },
        refreshAccessToken: {
            type: String,
            default: ""
        }
    },
    { versionKey: false }
);

const AdminModel = dbMainConnection.model("Admin", AdminSchema);

module.exports = AdminModel;
