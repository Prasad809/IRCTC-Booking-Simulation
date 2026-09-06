const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

fs.writeFileSync(path.join(__dirname, "private.pem"), privateKey);
fs.writeFileSync(path.join(__dirname, "public.pem"), publicKey);

console.log("Keys generated successfully.");