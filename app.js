const express = require("express");
const connection = require("./config/db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/shift", async (req, res) => {
  try {
    const result = await connection.query(
      "SELECT * FROM `optima_daily_shift_entry`"
    );
    // console.log(result);
    res.json(result);
  } catch (err) {
    console.error("Database Query Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Optima Backend Server!");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
