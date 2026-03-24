require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database.config");
const cors = require("cors");
const modelRoutes = require("./routes/model.routes");
const uploadRoutes = require("./routes/upload.routes")

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/models", modelRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
