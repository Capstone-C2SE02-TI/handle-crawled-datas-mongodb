import tagsRouter from "./tags.js";
import coinsRouter from "./coins.js";
import investorsRouter from "./investors.js";
import transactionsRouter from "./transactions.js";

function routing(app) {
	app.use("/tags", tagsRouter);
	app.use("/coins", coinsRouter);
	app.use("/investors", investorsRouter);
	app.use("/transactions", transactionsRouter);
}

export default routing;
