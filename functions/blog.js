import { log } from "../constants/index.js";
import { DBMainBlogModel } from "../models/index.js";

export const updateMultipleFieldType = async () => {
	await DBMainBlogModel.updateMany(
		{ type: "bao-cao" },
		{ $set: { type: "baocao" } }
	);
	await DBMainBlogModel.updateMany(
		{ type: "phan-tich" },
		{ $set: { type: "phantich" } }
	);
	await DBMainBlogModel.updateMany(
		{ type: "quy-dau-tu" },
		{ $set: { type: "quydautu" } }
	);

	log("Update successfully");
};
