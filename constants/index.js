const Promise = require("bluebird");

const fs = Promise.promisifyAll(require("fs"));

const { log } = require("console");

const BigNumber = require("bignumber.js");

const TWO_MINUTES_SECONDS = 120000,
    TEN_MINUTES_SECONDS = 600000;

module.exports = {
    fs,
    log,
    BigNumber,
    TWO_MINUTES_SECONDS,
    TEN_MINUTES_SECONDS
};
