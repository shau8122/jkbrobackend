const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/config.env" });
}

// Routes import
const userRoute = require("./routes/userRoute");
const orderRoute = require("./routes/orderRoute");

const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

const cors = require("cors");
app.set("trust proxy", 1);


const corsOptions = {
  origin: ["http://localhost:5173", "https://jkbros.netlify.app"], // Allow requests from any origin
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
