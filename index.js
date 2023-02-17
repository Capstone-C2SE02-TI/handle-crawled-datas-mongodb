import express from "express";
import dotenv from "dotenv";
import scripts from "./scripts/index.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 8000;

scripts();

app.listen(PORT, () => {
	console.log(`Server is listening at http://localhost:${PORT}/`);
});
