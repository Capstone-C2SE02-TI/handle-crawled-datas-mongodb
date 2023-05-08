import { saveConvertedTransactionsToDB } from "../services/transactions.js";
import { dropDBMainCollection } from "../services/index.js";

function TransactionsController() {
	this.updateTransactions = async (req, res, next) => {
		await dropDBMainCollection("transactions");
		await saveConvertedTransactionsToDB();
		
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

export default new TransactionsController();
