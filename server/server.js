require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database.config");
const cors = require("cors");
const modelRoutes = require("./routes/model.routes");
const uploadRoutes = require("./routes/upload.routes")
const contactRoutes = require("./routes/contact.routes");
const applicationRoutes = require("./routes/application.routes");
const blogRoutes = require("./routes/blogs.routes");

const app = express();

connectDB();

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin header) and configured frontends.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/models", modelRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/blogs", blogRoutes);



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
