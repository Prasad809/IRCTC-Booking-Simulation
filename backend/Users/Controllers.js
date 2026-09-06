require('dotenv').config();
const db = require("../dbConnection");
const bcrypt = require('bcryptjs');
const tokens = require("../AuthJwt/Auth");

const accessKey = process.env.ACCESS;
const refreshKey = process.env.REFRESH;

const signUp = async (req, res) => {
    try {
        const { userName, email,mobile, password } = req.body;
        
        if (!userName ||  !mobile || !email || !password) {
            return res.status(400).json({ status: false, message: [{ description: "Something went wrong, Bad Request" }] });
        }
        const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

        if (existing.length > 0) {
            return res.status(200).json({ status: false, message: [{ description: "User already exists, try with another email" }] });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (user_name, email,mobile, password, isActive) VALUES (?,?,?,?,?)",
            [userName, email,mobile, hashedPassword, "Y"]
        );
        return res.status(200).json({ status: true, message: [{ description: "User Register Successfully." }] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const signIn = async (req, res) => {
    try {
        const { userNameOrEmail, password } = req.body;
        if (!userNameOrEmail || !password) {
            return res.status(400).json({
                status: false,
                message: [{ description: "Email/UserName and password are required" }]
            });
        }

        const [users] = await db.query("SELECT * FROM users WHERE email = ? OR user_name = ?", [userNameOrEmail,userNameOrEmail]);
        const user = users[0];

        if (!user) {
            return res.status(200).json({
                status: false,
                message: [{ description: "User does not exist with these credentials" }]
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(200).json({ status: false, message: [{ description: "Invalid credentials" }] });
        }

        const rt = tokens.refreshToken({ userNameOrEmail, id: user.id }, refreshKey);
        const bt = tokens.accessToken({ userNameOrEmail, id: user.id }, accessKey);

        tokens.registerRefreshToken(rt.token);

        res.setHeader("bt", String(bt.token));
        res.setHeader("rt", String(rt.token));
        res.setHeader("bt-exp", bt.expiresAt);
        res.setHeader("rt-exp", rt.expiresAt);

        return res.status(200).json({
            status: true,
            message: [{ description: "User login successfully." }],
            role:user.role,
            userName:user.user_name
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const logout = async (req, res) => {
    try {
        const rt = req.headers['rt'];
        if (rt) tokens.revokeRefreshToken(rt);
        return res.status(200).json({ status: true, message: [{ description: "Logged out successfully" }] });
    } catch (error) {
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

module.exports = { signUp, signIn, logout };
