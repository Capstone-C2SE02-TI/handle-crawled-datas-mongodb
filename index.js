import express from "express";
import scripts from "./scripts/index.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

scripts();

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
