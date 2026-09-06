require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./Users/Router");
const accuntRouter = require("./CreateAccount/Router");
const auth = require("./AuthJwt/Auth");
const cmgpd = require("./AuthJwt/serverCmgpd");
const upload = require("./middleware/upload");
const decryptMiddleware = require("./Decryption/DecryptMiddleware");
const encryptMiddleware = require("./Decryption/EncryptMiddleware");
const dashboardRouter = require("./Dashboard/Router");
const passRouter = require("./passenger/Router");
const paymentsRouter = require("./payments/Router");
const trainRouter = require("./trains/Router");
const bookingRouter = require("./bookings/Router");
const lookUpRouter = require("./Lookups/Router");
const PORT = process.env.PORT || 8082;

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    exposedHeaders: ["rt", "bt", "bt-exp", "rt-exp"]
}));
require("./jobs/seatInventoryJob");


app.use('/cmgpd',cmgpd);
app.use(decryptMiddleware);
app.use(encryptMiddleware);


app.use("/", userRouter);
app.use('/tokens', auth.generateRtToken);
app.use("/passenger",auth.authMiddleWare,passRouter);
app.use("/payments",auth.authMiddleWare,paymentsRouter);
app.use("/trains",auth.authMiddleWare,trainRouter);
app.use("/bookings",auth.authMiddleWare,bookingRouter);
app.use("/", auth.authMiddleWare, lookUpRouter);

app.use('/', (req, res) => {
    res.send("<h1>IRCTC API is running</h1>");
});

app.listen(PORT, () => {
    console.log("Server Running At ", PORT);
});
