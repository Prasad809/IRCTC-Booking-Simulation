import CryptoJS from "crypto-js";
import { JSEncrypt } from "jsencrypt";

const AES_KEY = "12345678901234567890123456789012";

const PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxGYFtcchYLNiOlZcAV8q
JJtlil38ijWHg0b1VjV5rss9wVtW11tHQkm94MKyaklbwHf7mKwKvYyd0jWJIc7g
TOkGEp066sMaJVCKJypnH2rAvNUhUoFcFVfM/3EKjrI7Cmlg6cyav1H9GTIEX6cX
eMxe4g0C5CFkvhi8dD+znSrvXoC6UXHv6Vhe6qlAwx/rePh5X9uK7oB091ig3wEH
zOPa9O/PKIlHfLa4MKTeA341RdEiC1OT+RTwMSbypJ333h5ngm1EINcJBUk/W48T
i44QHvkdQFfHRDD9D7fXNTROjKZ3BSIRBptIWZdgMd0UM7rnKy34HXXoVz1yf4BF
owIDAQAB
-----END PUBLIC KEY-----
`;

export const encryptRSA = (text) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  const encrypted = encrypt.encrypt(String(text));
  if (!encrypted) {
    throw new Error("RSA Encryption Failed");
  }
  return encrypted;
};

export const encryptAES = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    AES_KEY
  ).toString();
};
