const dbPool = require("../dbConnection");

const activeAndDeActiveUser = async (req, res) => {
    const { userNameOrEmail, userId } = req.body;

    try {
        const [users] = await dbPool.query(
            `SELECT id, user_name, email, role, isActive
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                message: [{ description: "User not found" }]
            });
        }

        const user = users[0];
        if (user.role?.toUpperCase() !== "ADMIN") {
            return res.status(403).json({
                status: false,
                message: [{ description: "Access Denied" }]
            });
        }

        const [targetUsers] = await dbPool.query(
            `SELECT id, isActive
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (targetUsers.length === 0) {
            return res.status(404).json({
                status: false,
                message: [{ description: "Target user not found" }]
            });
        }

        const targetUser = targetUsers[0];
        const newStatus = targetUser.isActive === "Y" ? "N" : "Y";
        await dbPool.query(
            `UPDATE users
             SET isActive = ?
             WHERE id = ?`,
            [newStatus, userId]
        );

        return res.status(200).json({
            status: true,
            message: [{
                description:
                    `User ${newStatus === "Y" ? "activated" : "deactivated"} successfully..!`
            }]
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: [{
                description: "Internal Server Error"
            }]
        });
    }
};

const changePassword = async (req, res) => {
    const { userNameOrEmail, userId } = req.body;

    try {
        const [users] = await dbPool.query(
            `SELECT id, user_name, email, role, isActive
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                message: [{ description: "User not found" }]
            });
        }

        const user = users[0];
        if (user.role?.toUpperCase() !== "ADMIN") {
            return res.status(403).json({
                status: false,
                message: [{ description: "Access Denied" }]
            });
        }

        const [targetUsers] = await dbPool.query(
            `SELECT id, isActive
             FROM users
             WHERE id = ?`,
            [userId]
        );

        if (targetUsers.length === 0) {
            return res.status(404).json({
                status: false,
                message: [{ description: "Target user not found" }]
            });
        }

        await dbPool.query(
            `UPDATE users
             SET password = ?
             WHERE id = ?`,
            ["123456", userId]
        );

        return res.status(200).json({
            status: true,
            message: [{
                description:
                    `Reset the Password successfully..!`
            }]
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: [{
                description: "Internal Server Error"
            }]
        });
    }
};

const getAllUsersDetails = async (req, res) => {
    const { userNameOrEmail } = req.body;

    try {
        // Check requesting user
        const [users] = await dbPool.query(
            `SELECT id, user_name, email, mobile, role
             FROM users
             WHERE user_name = ? OR email = ?`,
            [userNameOrEmail, userNameOrEmail]
        );

        if (users.length === 0) {
            return res.status(404).json({
                status: false,
                message: [{ description: "User not found" }]
            });
        }

        const loggedInUser = users[0];

        // Only ADMIN can access this API
        if (loggedInUser.role?.toUpperCase() !== "ADMIN") {
            return res.status(403).json({
                status: false,
                message: [{ description: "Access Denied" }]
            });
        }

        // Get all users except ADMIN
        const [rows] = await dbPool.query(
            `SELECT
                id AS userId,
                user_name AS userName,
                email,
                mobile,
                role,
                isActive AS status
             FROM users
             WHERE UPPER(role) <> 'ADMIN'`
        );

        return res.status(200).json({
            status: true,
            users: rows,
            message: [{
                description: "Request processed successfully"
            }]
        });

    } catch (error) {
        console.log("getAllUsersDetails error:", error);

        return res.status(500).json({
            status: false,
            message: [{
                description: "Internal Server Error"
            }]
        });
    }
};


module.exports = { activeAndDeActiveUser, getAllUsersDetails, changePassword }