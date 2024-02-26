const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

require("dotenv").config({ path: "config/config.env" });

// Routes import
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());
app.set("trust proxy", 1);

// const allowedOrigins = [
//     'http://localhost:3000', // Replace this with your first frontend URL
//     'https://localhost:3001',   // Replace this with your second frontend URL
//   ];

// // cors cofiguration
// if (process.env.NODE_ENV !== "PRODUCTION") {
//     app.use(require('cors')({
//         origin: true,
//         allowedHeaders: ['Content-Type', 'Authorization'],
//         credentials:true,
//         methods: '*' ,
//         optionsSuccessStatus: 200,
//     }))
// }
const cors = require("cors");

const corsOptions = {
  origin: true, // Allow requests from any origin
  credentials: true, // Allow cookies across origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Specify allowed headers
  optionsSuccessStatus: 200, // Send 200 status for OPTIONS requests
};

app.use(cors(corsOptions));

app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute);

// app.use(express.static(path.join(__dirname + "./../frontend/build")));

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, "./../frontend/build/index.html"));
// })

// error middileware
app.use(errorMiddleware);

module.exports = app;
