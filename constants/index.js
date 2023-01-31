import Promise from "bluebird";
import fsModule from "fs";
const fs = Promise.promisifyAll(fsModule);

import { log } from "console";
import BigNumber from "bignumber.js";

const TWO_MINUTES_SECONDS = 120000,
    TEN_MINUTES_SECONDS = 600000;

export { fs, log, BigNumber, TWO_MINUTES_SECONDS, TEN_MINUTES_SECONDS };
