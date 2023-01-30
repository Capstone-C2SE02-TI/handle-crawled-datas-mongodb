require("dotenv").config();
require("./configs/connectDatabase/index.js");
require("./scripts/index.js");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
