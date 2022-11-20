const exportCollection = async (CollectionModel) => {
    return await CollectionModel.find({});
};

module.exports = {
    exportCollection
};
