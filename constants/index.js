const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));

const { log } = require("console");

module.exports = { fs, log };
