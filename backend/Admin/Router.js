const express = require("express");
const Router = express.Router();
const adminControler = require("./Controllers");

Router.post("/alUsrs",adminControler.getAllUsersDetails);
Router.post("/atDeAt",adminControler.activeAndDeActiveUser);
Router.post("/restPass",adminControler.changePassword);

module.exports = Router;
