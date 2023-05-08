import { updateTransactions } from "../services/transactions.js";

function TransactionsController() {
	this.updateTransactions = async (req, res, next) => {
		const executedTime = await updateTransactions();
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

export default new TransactionsController();
