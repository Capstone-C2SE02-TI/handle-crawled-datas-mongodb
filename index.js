import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import routing from "./routes/index.js";
import { DEVELOPMENT_URL } from "./constants/index.js";
import { swaggerSpecs } from "./configs/swagger/index.js";
import { PORT, SWAGGER_URL } from "./constants/index.js";

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

routing(app);

import scripts from "./scripts/index.js";
scripts();

app.listen(PORT, () => {
	console.log(`Server is listening at ${DEVELOPMENT_URL}`);
	console.log(`API Documentation: ${SWAGGER_URL}`);
});
