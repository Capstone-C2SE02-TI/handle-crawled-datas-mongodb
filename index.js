const PORT = 8000;

const express = require("express");

const database = require("./configs/connect-database");

const app = express();

require("./script.js");

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
