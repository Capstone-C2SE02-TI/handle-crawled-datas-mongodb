import swaggerJsDoc from "swagger-jsdoc";
import { DEVELOPMENT_URL } from "../../constants/index.js";

const swaggerOptions = {
	definition: {
		openapi: "3.0.3",
		info: {
			title: "SwaggerUI",
			version: "1.0.0",
			description: "A Simple Express Library API"
		},
		servers: [
			{
				url: DEVELOPMENT_URL,
				description: "Development"
			}
		]
	},
	apis: ["**/*.yaml"]
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
export { swaggerSpecs };
