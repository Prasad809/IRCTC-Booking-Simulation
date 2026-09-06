const express = require("express");

const Router = express.Router();
const bookingControl = require("./Controllers");

Router.post("/cnfmTkt", bookingControl.confirmBooking);
Router.post("/gtBkTkt", bookingControl.getMyBookings);
Router.post("/cnclBkTkt", bookingControl.cancelBooking);
module.exports = Router;
