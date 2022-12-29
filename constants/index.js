const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));

const { log } = require("console");

const BigNumber = require("bignumber.js");

module.exports = { fs, log, BigNumber };
