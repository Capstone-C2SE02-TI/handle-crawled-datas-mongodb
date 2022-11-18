require("dotenv").config();
require("./script.js");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const { connectDatabase } = require("./configs/connect-database");

connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
