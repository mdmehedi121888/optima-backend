const express = require("express");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const stationRoutes = require("./routes/stationRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const operatorRoutes = require("./routes/operatorRoutes");
const machineDataRoutes = require("./routes/machineDataRoutes");
const downtimeProblemRoutes = require("./routes/downtimeProblemRoutes");
const stopReasonRoutes = require("./routes/stopReasonRoutes");
const speedLossReasonRoutes = require("./routes/speedLossReasonRoutes");
const scrapReasonRoutes = require("./routes/scrapReasonRoutes");
const locationRoutes = require("./routes/locationRoutes");
const oeeMetricsRoutes = require("./routes/oeeMetricsRoutes");
const stationStatusRoutes = require("./routes/stationStatusRoutes");

const dotenv = require("dotenv");
const bodyParser = require("body-parser");

dotenv.config(); // Load environment variables from .env file

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Specify the exact origin of your frontend
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY || "your-default-secret", // Use a secure secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/machineData", machineDataRoutes);
app.use("/api/downtimeProblem", downtimeProblemRoutes);
app.use("/api/stopReasons", stopReasonRoutes);
app.use("/api/speedLossReasons", speedLossReasonRoutes);
app.use("/api/scrapReasons", scrapReasonRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/oee-metrics", oeeMetricsRoutes);
app.use("/api/stationStatus", stationStatusRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Optima Backend Server!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
