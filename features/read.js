const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

const getCollectionLength = async (CollectionModel) => {
    return await CollectionModel.count({});
};

module.exports = {
    exportCollection,
    getCollectionLength
};
