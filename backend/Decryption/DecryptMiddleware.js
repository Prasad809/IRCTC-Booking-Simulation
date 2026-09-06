const { decryptRequest } = require("./decryptRequest");
const db = require("../dbConnection");
require('dotenv').config();
const encyptTy = process.env.ENCTYPE;

const decryptMiddleware = async (req, res, next) => {
    const [response] = await db.query("SELECT * FROM cmgpd WHERE status = 'Y'");
    try {
        const encType = encyptTy|| "RSA";
        const lookUp = response || [];

        if (encType && req.body) {
            req.body = decryptRequest(req.body, encType, lookUp);
        }

        next();
    } catch (err) {
        return res.status(400).json({
            status: false,
            message: [{ description: "Failed to decrypt request." }]
        });
    }
};

module.exports = decryptMiddleware;