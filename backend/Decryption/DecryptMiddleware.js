require('dotenv').config();
const { decryptRequest } = require("./decryptRequest");
const db = require("../dbConnection");
const encyptTy = process.env.ENCTYPE;

const decryptMiddleware = async (req, res, next) => {
    const [response] = await db.query("SELECT * FROM cmgpd WHERE status = 'Y'");
    console.log(response,encyptTy,"ADP")
    try {
        const encType = encyptTy|| "RSA";
        const lookUp = response || [];

        if (encType && req.body) {
            console.log(req.body)
            req.body = decryptRequest(req.body, encType, lookUp);
            console.log(req.body)
        }

        next();
    } catch (err) {
        console.log(err)
    console.log("========== DECRYPT ERROR ==========");
    console.log("Message:", err.message);
    console.log("Code:", err.code);
    console.log("Stack:", err.stack);
    console.log("===================================");
        return res.status(400).json({
            status: false,
            message: [{ description: "Failed to decrypt request." }]
        });
    }
};

module.exports = decryptMiddleware;