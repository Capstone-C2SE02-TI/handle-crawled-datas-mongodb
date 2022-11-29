require("dotenv").config();
require("./configs/connect-database");
require("./script.js");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
