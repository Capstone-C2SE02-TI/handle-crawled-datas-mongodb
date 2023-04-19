import mongoose from "mongoose";
import { dbMainConnection } from "../../configs/connectDatabase/index.js";

const CommentSchema = new mongoose.Schema(
	{
		blogId: {
			type: String,
			required: true
		},
		userId: {
			type: String,
			trim: true,
			required: true
		},
		userWalletAddress: {
			type: String,
			trim: true,
			required: true
		},
		userFullName: {
			type: String,
			trim: true,
			default: ""
		},
		userAvatar: {
			type: String,
			trim: true
		},
		content: {
			type: String,
			trim: true,
			required: true
		},
		children: {
			type: Array,
			default: []
		}
	},
	{ timestamps: true, versionKey: false }
);

const CommentModel = dbMainConnection.model("Comment", CommentSchema);
export default CommentModel;
