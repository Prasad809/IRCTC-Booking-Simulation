const db = require("../dbConnection");
require('dotenv').config();
const encyptTy = process.env.ENCTYPE || "RSA";

const cmgpd = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM cmgpd");
        const response = rows?.map(item => {
            if (item.status === "Y") {
                return {
                    key: item.id,
                    value: item.value
                };
            }
            return null;
        }).filter(Boolean);

        return res.status(200).json({ status: true, message: [{ code: "1002", description: "data retrieve successfully" }], lookUp: response, encypt: encyptTy })
    } catch (error) {
        return res.status(500).json({ status: false, message: [{ code: "error", description: "Internal Server Problem" }] })
    }
}

module.exports = cmgpd;