const express = require("express");

const Router = express.Router();
const borrowerControl = require("./Controllers");
const upload = require("../middleware/upload");

Router.post("/personal", borrowerControl.createborrowerPersonals);
Router.post("/bankDtls", borrowerControl.createBorrowerBanksDtls);
Router.post("/studentDtls", borrowerControl.createBorrowerStudents);
Router.post("/doc", 
    upload.fields([
        { name: "aadharImage", maxCount: 1 },
        { name: "accountBookImage", maxCount: 1 },
        { name: "studentIdCardImage", maxCount: 1 }
    ]), borrowerControl.storeDocuments);

module.exports = Router;
