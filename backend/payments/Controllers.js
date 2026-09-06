const dbPool = require("../dbConnection");

function maskCardNumber(cardNumber) {
    return cardNumber ? "**** **** **** " + cardNumber?.slice(-4) : null;
}

const addPaymentMethods = async (req, res) => {
    const { paymentType, userNameOrEmail, nickname, cardHolderName, cardNumber, expiry, upiId } = req.body;

    try {
        if (!paymentType || !userNameOrEmail) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing" }] });
        }
        if (paymentType === "CARD" && (!cardHolderName || !cardNumber || !expiry)) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing for CARD" }] });
        } else if (paymentType === "UPI" && !upiId) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing for UPI" }] });
        }
        const [rows] = await dbPool.query(`SELECT * FROM users WHERE user_name = ? OR email=?`, [userNameOrEmail, userNameOrEmail]);
        if (rows.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        const userId = rows[0]?.id;
        const [existingPayment] = await dbPool.query(
            `SELECT id
            FROM payment_methods
            WHERE user_id = ?
            AND (
                (card_number = ? AND expiry = ?)
                OR (upi_id = ? AND upi_id IS NOT NULL)
            )`,
            [
                userId,
                cardNumber || null,
                expiry || null,
                upiId || null
            ]
        );

        if (existingPayment.length > 0) {
            return res.status(200).json({
                status: false,
                message: [
                    {
                        description: "Card or UPI ID already exists"
                    }
                ]
            });
        }

        const maskedCardNum = maskCardNumber(cardNumber);
        const [methods] = await dbPool.query(`INSERT INTO payment_methods 
            (user_id,type,label,holder_name,masked_number,expiry,upi_id,card_number) values (?,?,?,?,?,?,?,?)`,
            [userId, paymentType, nickname, cardHolderName, maskedCardNum, expiry, upiId, cardNumber]);
            const paymentId = methods.insertId;
        return res.status(200).json({ status: true,paymentId,message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

const getPaymentMethods = async (req, res) => {
    const { userNameOrEmail } = req.body;
    try {
        if (!userNameOrEmail) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing" }] });
        }
        const [rows] = await dbPool.query(`SELECT * FROM users WHERE user_name = ? OR email=?`, [userNameOrEmail, userNameOrEmail]);
        if (rows.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        const userId = rows[0]?.id;
        const [listOfMethods] = await dbPool.query(
            `SELECT 
                    id,
                    type,
                    label AS nickName,
                    holder_name AS holderName,
                    expiry As expiry,
                    upi_id AS upiId,
                    card_number As cardNumber
                    FROM payment_methods
                    WHERE user_id = ?
                    AND isActive = ?`,
            [userId, 'Y']
        );
        return res.status(200).json({ status: true, listOfMethods, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

const removePaymentMethods = async (req, res) => {
    const { userNameOrEmail, paymentMethodId } = req.body;

    try {
        if (!userNameOrEmail || !paymentMethodId) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing" }] });
        }
        const [rows] = await dbPool.query(`SELECT * FROM users WHERE user_name = ? OR email=?`, [userNameOrEmail, userNameOrEmail]);
        if (rows.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        const userId = rows[0]?.id;
        await dbPool.query(
            `UPDATE payment_methods
                SET isActive = ?
                WHERE id = ? AND user_id = ?`,
            ['N', paymentMethodId, userId]
        );
        return res.status(200).json({ status: true, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

module.exports = { addPaymentMethods, removePaymentMethods, getPaymentMethods }