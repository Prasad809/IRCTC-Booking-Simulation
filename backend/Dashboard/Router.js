const express = require("express");

const Router = express.Router();
const dashbordControl = require("./Controllers");

Router.post("/notify", dashbordControl.notifications);
Router.post("/sentOtp", dashbordControl.sendOtp);
Router.post("/veriftOtp", dashbordControl.verifyOtp);
Router.post("/borrower", dashbordControl.getUserDetails);

module.exports = Router;
