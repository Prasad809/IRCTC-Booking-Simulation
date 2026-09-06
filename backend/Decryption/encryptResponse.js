require("dotenv").config();

const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const db = require("../dbConnection");


const encType = process.env.ENCTYPE || "RSA";

const AES_KEY = "12345678901234567890123456789012";

const publicKey = process.env.publicKey?.replace(/\\n/g, "\n") 
|| fs.readFileSync(path.join(__dirname, "../Keys/public.pem"),"utf8")
|| `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxGYFtcchYLNiOlZcAV8q
JJtlil38ijWHg0b1VjV5rss9wVtW11tHQkm94MKyaklbwHf7mKwKvYyd0jWJIc7g
TOkGEp066sMaJVCKJypnH2rAvNUhUoFcFVfM/3EKjrI7Cmlg6cyav1H9GTIEX6cX
eMxe4g0C5CFkvhi8dD+znSrvXoC6UXHv6Vhe6qlAwx/rePh5X9uK7oB091ig3wEH
zOPa9O/PKIlHfLa4MKTeA341RdEiC1OT+RTwMSbypJ333h5ngm1EINcJBUk/W48T
i44QHvkdQFfHRDD9D7fXNTROjKZ3BSIRBptIWZdgMd0UM7rnKy34HXXoVz1yf4BF
owIDAQAB
-----END PUBLIC KEY-----`
;

function encryptAES(data) {
    return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        AES_KEY
    ).toString();
}

function encryptRSA(data) {
    const encrypted = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING
        },
        Buffer.from(JSON.stringify(data), "utf8")
    );
    return encrypted.toString("base64");
}


// Recursive encryption
const encryptSensitiveFields = (data, encType, lookUp) => {
    if (data === null || data === undefined) {
        return data;
    }
    const sensitiveFields = new Set(lookUp.map(item => item.value.toLowerCase()));

    // Array
    if (Array.isArray(data)) {
        return data.map(item =>encryptSensitiveFields(item,encType,lookUp));
    }

    // Object
    if (typeof data === "object") {
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (value === null || value === undefined || value === "") {
                return;
            }

            // Sensitive field
            if (sensitiveFields.has(key.toLowerCase())) {
                if (encType === "AES") {
                    data[key] = encryptAES(value);
                } else if (encType === "RSA") {
                    data[key] = encryptRSA(value);
                }
                return;
            }
            // Nested object / array
            if (typeof value === "object") {
                data[key] = encryptSensitiveFields(value,encType,lookUp);
            }
        });
    }

    return data;
};


// Get lookup only once
const encryptResponse = async (data) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM cmgpd WHERE status = 'Y'"
        );

        const lookUp = rows || [];
        const encryptedData = encryptSensitiveFields(data,encType,lookUp);
        return encryptedData;

    } catch (error) {
        console.error("Response Encryption Error:",error);
        throw error;
    }
};


module.exports = {
    encryptResponse
};