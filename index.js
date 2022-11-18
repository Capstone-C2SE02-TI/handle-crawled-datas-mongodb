require("dotenv").config();
require("./script.js");
require("./configs/connect-database");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
