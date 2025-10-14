require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const authRoute = require("./routes/authRoute");
const activityRoute = require("./routes/activityRoute");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/activities", activityRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server chạy ở cổng ${PORT}`));
