const jwt = require("jsonwebtoken");
require('dotenv').config();

const accessKey = process.env.ACCESS;
const refreshKey = process.env.REFRESH;

const btExpiresIn = 10 * 60;       // 10 minutes (in seconds)
const rtExpiresIn = 20 * 60;       // 20 mints (in seconds)

const accessToken = (payload, key) => {
    const accessTkn = jwt.sign(payload, key, {
        expiresIn: btExpiresIn
    });
    return {
        token: accessTkn,
        expiresIn: btExpiresIn,
        expiresAt: Date.now() + btExpiresIn * 1000
    };
};

const refreshToken = (payload, key) => {
    const refresTkn = jwt.sign(payload, key, {
        expiresIn: rtExpiresIn
    });
    return {
        token: refresTkn,
        expiresIn: rtExpiresIn,
        expiresAt: Date.now() + rtExpiresIn * 1000
    };
};

const verifyJwt = (token, key) => {
    return jwt.verify(token, key);
};

// Protects routes — expects the bearer/access token in the "bt" header
const authMiddleWare = (req, res, next) => {
    const btTkn = req.headers['bt'];

    if (!btTkn) {
        return res.status(403).json({ status: false, message: [{ description: "Please Contact Administrator" }] });
    }

    try {
        const decoded = verifyJwt(btTkn, accessKey);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ status: false, message: [{ description: "Invalid token" }] });
    }
};

// In-memory store of valid refresh tokens (swap for a DB table in production)
let refreshTokens = [];

// Called from /tokens — reads "rt" header, issues a new "bt"
const generateRtToken = async (req, res) => {
    const refreshTkn = req.headers['rt'];
    if (!refreshTkn) {
        return res.status(401).json({ status: false, message: [{ description: "Token Not found" }] });
    }
    if (!refreshTokens.includes(refreshTkn)) {
        return res.status(403).json({ status: false, message: [{ description: "Invalid Token" }] });
    }
    try {
        const user = await verifyJwt(refreshTkn, refreshKey);
        const { userNameOrEmail, id } = user;
        const bt = accessToken({ userNameOrEmail, id }, accessKey);
        res.setHeader("bt", String(bt.token));
        res.setHeader("bt-exp", bt.expiresAt);

        return res.status(200).json({ status: true, message: [{ description: "Bearer token created" }] });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                status: false,
                message: [{ description: "Refresh token expired. Please login again." }]
            });
        }
        return res.status(500).json({ status: false, message: [{ description: "Internal Server Problem" }] });
    }
};

const registerRefreshToken = (rt) => {
    refreshTokens.push(rt);
};

const revokeRefreshToken = (rt) => {
    refreshTokens = refreshTokens.filter((t) => t !== rt);
};

module.exports = {
    accessToken,
    refreshToken,
    verifyJwt,
    authMiddleWare,
    generateRtToken,
    registerRefreshToken,
    revokeRefreshToken,
    btExpiresIn,
    rtExpiresIn
};
