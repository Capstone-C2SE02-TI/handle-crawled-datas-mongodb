import { updateTags } from "../services/tags.js";

function TagsController() {
	this.updateTags = async (req, res, next) => {
		const executedTime = await updateTags();
		executedTime
			? res.status(200).json({
					message: "successfully",
					executedTime: executedTime,
					error: null
			  })
			: res.status(400).json({
					message: "failed",
					executedTime: null,
					error: null
			  });
	};
}

export default new TagsController();
