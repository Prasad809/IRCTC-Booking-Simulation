const express = require("express");
const Router = express.Router();
const jobControler = require("./seatInventoryJob");

Router.get("/job",jobControler.generateSeatInventory);

module.exports = Router;
