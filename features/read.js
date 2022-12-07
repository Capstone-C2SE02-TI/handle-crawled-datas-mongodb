const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getCollectionDatas = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getCollectionLength = async (CollectionModel) => {
    return await CollectionModel.count({});
};

module.exports = {
    exportCollection,
    getCollectionDatas,
    getCollectionLength
};
