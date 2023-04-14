import { log } from "../constants/index.js";
import { dbMainConnection } from "../configs/connectDatabase/index.js";

const exportCollection = async (CollectionModel) => {
	return await CollectionModel.find({});
};

const getCollectionLength = async (CollectionModel) => {
	return await CollectionModel.count({});
};

const dropDBMainCollection = async (collectionName) => {
	await dbMainConnection.dropCollection(collectionName, (error, result) => {
		if (error) {
			log(`Drop collection ${collectionName} failed`);
			throw new Error(error);
		} else {
			log(`Drop collection ${collectionName} successfully`);
		}
	});
};

export { exportCollection, getCollectionLength, dropDBMainCollection };
