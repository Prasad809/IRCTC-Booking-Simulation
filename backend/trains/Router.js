const express = require("express");

const Router = express.Router();
const trainControl = require("./Controllers");

Router.post("/cTrnRts", trainControl.createTrainRoutes);
Router.post("/gTrnRts", trainControl.getTrainRoutes);
Router.post("/rTrnRts", trainControl.removeTrainRoutes);
Router.get("/gTrnsLst", trainControl.getTrainsList);
Router.post("/gTrnsSrch", trainControl.searchTrains);

module.exports = Router;
