import { Types } from "mongoose";
import { log } from "console";
import BigNumber from "bignumber.js";
import Promise from "bluebird";
import fsModule from "fs";

const fs = Promise.promisifyAll(fsModule);
const ObjectId = Types.ObjectId;

const TWO_MINUTES_SECONDS = 2 * 60 * 1000;
const TEN_MINUTES_SECONDS = 10 * 60 * 1000;

export {
    log,
    BigNumber,
    fs,
    ObjectId,
    TWO_MINUTES_SECONDS,
    TEN_MINUTES_SECONDS
};
