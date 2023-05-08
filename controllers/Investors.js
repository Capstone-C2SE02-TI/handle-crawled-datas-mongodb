import { updateInvestors } from "../services/investors.js";

function InvestorsController() {
	this.updateInvestors = async (req, res, next) => {
		const executedTime = await updateInvestors();
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

export default new InvestorsController();
