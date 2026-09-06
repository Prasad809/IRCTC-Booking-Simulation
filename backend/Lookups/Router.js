const express = require('express');
const Router = express.Router();
const lookUpControl = require("./controller");

Router.get("/trnCls",lookUpControl.trainClasses);
Router.get("/trnBrt",lookUpControl.trainBerths);
Router.get("/trnQta",lookUpControl.quotas);

Router.get("/pytp",lookUpControl.paymentTypes);
Router.get("/pySts",lookUpControl.paymentStatus);
Router.get("/psgSts",lookUpControl.passengerStatus);
Router.get("/cnlSts",lookUpControl.cancelStatus);

Router.get("/gnds",lookUpControl.genders);
Router.post("/gtUsr",lookUpControl.getUserDetails);
Router.post("/upUsr",lookUpControl.updateUserDetails);
Router.post("/mnAuth",lookUpControl.menusAuth);
Router.get("/days",lookUpControl.weekDaysList);

module.exports = Router;