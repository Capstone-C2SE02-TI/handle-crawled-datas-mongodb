const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccountMain = require("./service-account-Capstone-C1SE04-TI-Main.json");

initializeApp({
    credential: cert(serviceAccountMain),
});

const database = getFirestore();

module.exports = database;
