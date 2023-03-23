import { DBMainUserModel } from "../models/index.js";

export const deleteFieldsInUsersCollection = async () => {
	await DBMainUserModel.updateMany(
		{},
		{ $unset: { accessToken: "", refreshAccessToken: "" } }
	);
};
