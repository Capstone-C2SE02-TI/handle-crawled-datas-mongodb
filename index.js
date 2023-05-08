import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUI from "swagger-ui-express";
import routing from "./routes/index.js";
import { DEVELOPMENT_URL } from "./constants/index.js";
import { swaggerSpecs } from "./configs/swagger/index.js";
import { PORT, SWAGGER_URL } from "./constants/index.js";

// Config Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParse());

// Routing
routing(app);

app.listen(PORT, () => {
	console.log(`Server is listening at ${DEVELOPMENT_URL}/`);
	console.log(`API Documentation: ${SWAGGER_URL}`);
});
