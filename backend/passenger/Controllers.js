const dbPool = require("../dbConnection");

const addPassengerToMaster = async (req, res) => {
    const { userNameOrEmail, passengerName, age, gender, berthPreference } = req.body;
    try {
        if (!userNameOrEmail || !passengerName || !age || !gender || !berthPreference) {
            return res.json({ status: false, message: [{ descrption: "Required fields Missing" }] }).status(400)
        }
        const [rows] = await dbPool.query(`SELECT * FROM users WHERE user_name = ? OR email = ?`, [userNameOrEmail, userNameOrEmail]);
        if (rows.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        const userId = rows[0]?.id;
        const [existingPassenger] = await dbPool.query(`SELECT passenger_id FROM passengers
            WHERE user_id = ?
            AND passenger_name = ?
            AND age = ?
            AND gender = ?`, [userId, passengerName, age, gender]
        );

        if (existingPassenger?.length > 0) {
            return res.status(409).json({
                status: false, message: [{ description: "Passenger already exists" }]
            });
        }
        await dbPool.query(`INSERT INTO passengers (user_id,passenger_name,age,gender,berth_preference) values (?,?,?,?,?)`,
            [userId, passengerName, age, gender, berthPreference]);
        return res.status(200).json({ status: true, message: [{ descrption: "Request processed successfully" }] })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};
const removePassengerToMaster = async (req, res) => {
    const { userNameOrEmail, passengerId } = req.body;
    try {
        if (!userNameOrEmail || !passengerId) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing" }] })
        }
        const [rows] = await dbPool.query(`SELECT * FROM users WHERE user_name = ? OR email = ?`, [userNameOrEmail, userNameOrEmail]);
        if (rows.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        const userId = rows[0]?.id;
        await dbPool.query(
            `UPDATE passengers
                SET isActive = 'N'
                WHERE passenger_id = ?
                AND user_id = ?`,
            [passengerId, userId]
        );

        return res.status(200).json({status: true,message: [{description: "Passenger deactivated successfully"}]
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

const getPassengerToMaster = async (req, res) => {
    const { userNameOrEmail } = req.body;
    try {
        if (!userNameOrEmail) {
            return res.status(400).json({ status: false, message: [{ descrption: "Required fields Missing" }] })
        }
        const [rows] = await dbPool.query(`SELECT * FROM users WHERE user_name = ? OR email = ?`, [userNameOrEmail, userNameOrEmail]);
        if (rows.length === 0) {
            return res.status(404).json({ status: false, message: [{ description: "User not found" }] });
        }
        const userId = rows[0]?.id;
        
        const [allPassengers] = await dbPool.query(`SELECT passenger_id AS id,passenger_name AS name,age,gender, 
            berth_preference AS berthPreference FROM passengers
            WHERE user_id = ? AND isActive = 'Y'`, [userId]
        );
        return res.status(200).json({ status: true, message: [{ description: "Passengers retrieved successfully" }], data: allPassengers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ descrption: "internal Server Error" }] })
    }
};

module.exports = { addPassengerToMaster, getPassengerToMaster,removePassengerToMaster }