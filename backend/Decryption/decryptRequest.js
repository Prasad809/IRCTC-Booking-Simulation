const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const AES_KEY = "12345678901234567890123456789012";
const privateKey = process.env.privateKey?.replace(/\\n/g, "\n") || fs.readFileSync(path.join(__dirname, "../Keys/private.pem"),"utf8");

function decryptAES(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, AES_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}


function decryptRSA(encryptedText) {
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    Buffer.from(encryptedText, "base64")
  );
  return decrypted.toString("utf8");
}

function decryptRequest(data, encType, lookUp) {
  if (data === null || data === undefined) {
    return data;
  }

  const sensitiveFields = new Set(
    lookUp.map(item => item.value.toLowerCase())
  );

  if (Array.isArray(data)) {
    return data.map(item => {
      return decryptRequest(item, encType, lookUp);
    });
  }

  if (typeof data === "object") {
    Object.keys(data).forEach(key => {
      const value = data[key];
      if (value === null || value === undefined || value === "") {
        return;
      }
      if (sensitiveFields.has(key.toLowerCase())) {
        if (encType === "AES") {
          data[key] = decryptAES(value);
        } else if (encType === "RSA") {
          data[key] = decryptRSA(value);
        }
        return;
      }

      if (typeof value === "object") {
        data[key] = decryptRequest(value,encType,lookUp);
      }
    });
  }
  return data;
}

module.exports = { decryptRequest }