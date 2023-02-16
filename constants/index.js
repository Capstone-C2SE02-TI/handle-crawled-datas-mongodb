import { log } from "console";
import BigNumber from "bignumber.js";
import Promise from "bluebird";
import fsModule from "fs";

const fs = Promise.promisifyAll(fsModule);

const TWO_MINUTES_SECONDS = 120000;
const TEN_MINUTES_SECONDS = 600000;

export { log, BigNumber, fs, TWO_MINUTES_SECONDS, TEN_MINUTES_SECONDS };
