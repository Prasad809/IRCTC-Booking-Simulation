const express = require("express");

const Router = express.Router();
const passControl = require("./Controllers");

Router.post("/aPsMst", passControl.addPassengerToMaster);
Router.post("/rPsMst", passControl.removePassengerToMaster);
Router.post("/gPsMst", passControl.getPassengerToMaster);

module.exports = Router;
