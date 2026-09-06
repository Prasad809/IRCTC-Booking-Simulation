const express = require("express");

const Router = express.Router();
const loansControl = require("./Controllers");

Router.post("/getLoans", loansControl.getAvailableLoanPlans);
Router.post("/applyLoan", loansControl.applyLoan);

module.exports = Router;
