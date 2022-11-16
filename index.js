const { connectDatabase } = require("./configs/connect-database");
require("./script.js");

const express = require("express");
const app = express();
const PORT = 8000;

connectDatabase();

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}/`);
});
