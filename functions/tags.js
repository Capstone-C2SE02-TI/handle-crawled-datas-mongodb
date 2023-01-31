import { fs, log } from "../constants/index.js";
import { DBCrawlCategoryModel, DBMainTagModel } from "../models/index.js";

const saveCategoriesToFile = async () => {
    const categories = await DBCrawlCategoryModel.find({}).lean();

    await fs.writeFileAsync(
        `./databases/DB_Crawl/categories.json`,
        JSON.stringify(categories),
        (error) => {
            if (error) {
                log(`Write file categories.json failed`);
                throw new Error(error);
            }
        }
    );

    log("Write categories into file successfully");
};

const saveCategoriesToDB = async () => {
    const categories = require(`../databases/DB_Crawl/categories.json`);

    for (let i = 0; i < categories.length; i++) {
        try {
            await DBMainTagModel.create({
                id: i + 1,
                name: categories[i].name,
                updateDate: new Date()
            })
                .then((data) => {})
                .catch((error) => {
                    log(`Write tag ${i + 1} in DB failed`);
                    throw new Error(error);
                });
        } catch (error) {
            log(`Write tag ${i + 1} in DB failed`);
            throw new Error(error);
        }
    }

    log("Write tags in DB successfully");
};

export { saveCategoriesToFile, saveCategoriesToDB };
