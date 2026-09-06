const express = require("express");

const Router = express.Router();
const userControl = require("./Controllers");

Router.post("/signUp", userControl.signUp);
Router.post("/auth", userControl.signIn);
Router.post("/logout", userControl.logout);

module.exports = Router;
