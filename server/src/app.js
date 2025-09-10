const searchRouter = require("../routers/searchRouter");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");

const userRouter = require("../routers/userRouter");
const authRouter = require("../routers/authRouter");

const maintenanceRouter = require("../routers/maintenanceRouter");
const routeRouter = require("../routers/routeRouter");
const fuelRouter = require("../routers/fuelRouter");
const fuelUseRouter = require("../routers/fuelUseRouter");

const bookingRouter = require("../routers/bookingRouter");
const paymentRouter = require("../routers/paymentRouter");
const busRouter = require("../routers/busRouter");




const app = express();

app.use(cors({
  origin: "http://localhost:470",
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/search", searchRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use("/api/maintenance", maintenanceRouter);
app.use("/api/fuels", fuelRouter);
app.use("/api/fuel_use", fuelUseRouter);
app.use("/api/bus", busRouter);

app.use("/api/routes", routeRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/payments", paymentRouter);

app.get("/test", (req, res) =>{
res.status(200).send({
    message: "API IS WORKING",
  });
});

app.use((req, res, next) =>{
  next(createError(404, "route not found"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;

