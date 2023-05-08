import { dbMainConnection } from "../configs/connectDatabase/index.js";

export const exportCollection = async (CollectionModel) => {
	return await CollectionModel.find({});
};

export const getCollectionLength = async (CollectionModel) => {
	return await CollectionModel.count({});
};

export const dropDBMainCollection = async (collectionName) => {
	await dbMainConnection.dropCollection(collectionName);
};
