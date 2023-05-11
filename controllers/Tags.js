import { saveCategoriesToFile, saveCategoriesToDB } from "../services/tags.js";
import { dropDBMainCollection } from "../services/index.js";

function TagsController() {
	this.updateTags = async (req, res, next) => {
		await saveCategoriesToFile();
		await dropDBMainCollection("tags");
		await saveCategoriesToDB();
		
		true
			? res.status(200).json({
					message: "successfully",
					// executedTime: executedTime,
					error: null
			  })
			: res.status(400).json({
					message: "failed",
					// executedTime: null,
					error: null
			  });
	};
}

export default new TagsController();
