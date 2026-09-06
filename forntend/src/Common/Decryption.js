import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

const AES_KEY = process.env.REACT_APP_AES_KEY || "12345678901234567890123456789012";
const PRIVATE_KEY = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEZgW1xyFgs2I6
VlwBXyokm2WKXfyKNYeDRvVWNXmuyz3BW1bXW0dCSb3gwrJqSVvAd/uYrAq9jJ3S
NYkhzuBM6QYSnTrqwxolUIonKmcfasC81SFSgVwVV8z/cQqOsjsKaWDpzJq/Uf0Z
MgRfpxd4zF7iDQLkIWS+GLx0P7OdKu9egLpRce/pWF7qqUDDH+t4+Hlf24rugHT3
WKDfAQfM49r0788oiUd8trgwpN4DfjVF0SILU5P5FPAxJvKknffeHmeCbUQg1wkF
ST9bjxOLjhAe+R1AV8dEMP0Pt9c1NE6MpncFIhEGm0hZl2Ax3RQzuucrLfgddehX
PXJ/gEWjAgMBAAECggEALH+1MX+h12gtjGw+wmzOfqba9ePfsWz5fEwakGLjZDBW
mLXaUkczORi+NevHQv/GEzDcR7ZLZLE0nQlWPdvCxIpTvunzDHgSN3wtITyhSuQE
MYTU3P3EYG2ZXBM/wh8t82j29WJPeaPZBdloVkfksJEVuoAaNJhAXDX8lRZN2wEW
xKfz0L4IK47RSywK7L273FUb4KNkorlRqrRsfPvUHrVE/xE7N3MHgmsbwaV2isZE
zH143eqCVZgY87wsszkDem7v+z41ihB4pTsApuTaOXPvgoFOMSJONAlASL0tiBQ/
gqKsgY+hecSmyOtpUyyxomujwFA+/E/p7gF86kCvcQKBgQDkaW3ULZ9LGrVT5fxG
iZYo798KmlTyQIIR37rve6hOj7oCbZOF7WjLJfaqiLdwY3SUCwhoU0Y4q3v+LzLC
xFgmO8NOBviH/X5XIP6rDzTkFmmQWbJcnd1HrWGHTp2eRv6gEsbRJ66qA8mzu8lU
UAYb63pzs4nqW0erZPaQtcK3mwKBgQDcHrsjXX52F9+gsrFR/5mB0IsYBe44/pNE
UWu+o4bFOpaEGPwUq8mYgG0oy9ovVQdYHjZd+iCgfIApZ0FUWXn1XY9qnJI4LT3+
quea8AFGiXdN9L3sDiKVr2eDX87ThOSbngXvnVlrtfE9xIF6d9RNCH4iMqDXh0XE
TPzalgs+mQKBgQDcYcD/ZNl6PJXSEmg7osrIStDYSRpG9ujI2CZkpNo6msBtUU5y
fSOMRt/doLXlcYBsysxc5GQvj32+PcnrVEh881K4uU8Y3wQEiyhM4go1PE60YWcP
p512aBpe1AKOUY+h4RwFeBU1oxv9F+XkPKX4UFbAxez+uv3GqE6iR01NmwKBgQDc
C9CSMwWXspf4wonm6figQES8WDlkOoInuqlWI403nzEWjw947p6SWFhHfzn3NS4p
VdKNsd1p8ewA99rkIqp7sfML5cd6ZyfhbSIoziLIS+W7RZ2S3DKQpo95Uo6k/uW1
94wBlK/usCygzc+OCTpvY70MHMaTjwQcj8X6EiLdiQKBgH39Jw7jvDVk+uCBFyCZ
3B2GZuWoajEgue3lW1iEEC6PNyfG7FoHJaWEMNXbw3y5ZdA8yypSw09Sx5192sAy
po2z4G19MlxTzPl1Knf3whEjxFF+84IZToU/K9nw0fNmsMG81wxYZk9AMV+KCX2T
SBQagr86jZ/vuV0OdetFsovD
-----END PRIVATE KEY-----
`;

export const decryptAES = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData,AES_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedText) {
            throw new Error("AES decryption failed");
        }
        return JSON.parse(decryptedText);
    } catch (error) {
        console.log("AES Decryption Error:", error);
        throw new Error("AES decryption failed");
    }
};

export const decryptRSA = (encryptedData) => {
    try {
        const decrypt = new JSEncrypt();

        decrypt.setPrivateKey(PRIVATE_KEY);

        const decrypted = decrypt.decrypt(encryptedData);
        if (decrypted === false) {
            throw new Error("RSA decryption failed");
        }
        return JSON.parse(decrypted);
   } catch (error) {
        console.error("RSA Decryption Error:", error);
        throw new Error("RSA decryption failed");
    }
};

