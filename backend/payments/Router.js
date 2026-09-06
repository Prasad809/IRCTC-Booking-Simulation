const express = require("express");

const Router = express.Router();
const paymentControl = require("./Controllers");

Router.post("/getMthds", paymentControl.getPaymentMethods);
Router.post("/addpayMthds", paymentControl.addPaymentMethods);
Router.post("/rempayMthds", paymentControl.removePaymentMethods);

module.exports = Router;
