const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const hymnRoutes = require("./routes/hymnRoutes");
const adminRoutes = require("./routes/adminRoutes");
const eventRoutes = require("./routes/eventRoutes");
const sermonRoutes = require("./routes/sermonRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const albumRoutes = require("./routes/albumRoutes");
const ministryRoutes = require("./routes/ministryRoutes");
const leadershipRoutes = require("./routes/leadershipRoutes");
const prayerRoutes = require("./routes/prayerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");

// Error middleware
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/uploads", uploadRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CAC Lifegate Centre API is running",
  });
});

// API Routes
app.use("/api/hymns", hymnRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sermons", sermonRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/ministries", ministryRoutes);
app.use("/api/leadership", leadershipRoutes);
app.use("/api/prayers", prayerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/uploads", uploadRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`CAC Lifegate backend running on port ${PORT}`);
});