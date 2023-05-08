import { updateCoins } from "../services/coins.js";

function CoinsController() {
	this.updateCoins = async (req, res, next) => {
		const executedTime = await updateCoins();
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

export default new CoinsController();
