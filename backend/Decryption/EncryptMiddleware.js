const { encryptResponse } = require("./encryptResponse");

const encryptResponseMiddleware = (req, res, next) => {
    if (req.path === "/cmgpd") {
        return next();
    }

    const originalJson = res.json;
    res.json = async function (data) {
        try {
            const encryptedData = await encryptResponse(data);
            if (res.headersSent) {
                return;
            }
            return originalJson.call(this,encryptedData);
        } catch (error) {
            if (res.headersSent) {
                return;
            }
            return originalJson.call(this,data);
        }
    };
    next();
};

module.exports = encryptResponseMiddleware;