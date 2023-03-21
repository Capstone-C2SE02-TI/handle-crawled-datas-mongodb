import { DBMainUserModel } from "../models/index.js";

export const deleteFieldsInUsersCollection = async () => {
	await DBMainUserModel.updateMany(
		{},
		{ $unset: { phoneNumber: "", username: "", email: "", password: "" } }
	);
};
