import {
	saveCoinsToFile,
	saveConvertedCoinCollectionToFile,
	saveConvertedCoinCollectionToDB
} from "../services/coins.js";

function CoinsController() {
	this.updateCoins = async (req, res, next) => {
		await saveCoinsToFile();
		await saveConvertedCoinCollectionToFile();
		saveConvertedCoinCollectionToDB(id4);
		
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

export default new CoinsController();
