const generateSchema = require("generate-schema");

const generateSchemaFromJsonData = async (jsonData) => {
    return generateSchema.mongoose(jsonData);
};

module.exports = { generateSchemaFromJsonData };
