const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const favoritesRoutes = require("./routes/favorites");
const commentsRoutes = require("./routes/comments");
const mealRoutes = require("./routes/meal");
const userRoutes = require("./routes/user");
const notificationRoute = require("./routes/notification");

var express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
//MIDDLEWARES
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/test", (req, res) => {
  console.log("test ok");
});

app.use("/auth", authRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/comments", commentsRoutes);
app.use("/meal", mealRoutes);
app.use("/user", userRoutes);
app.use("/notification", notificationRoute);

// Connect to MongoDB
console.log("connecting to database...");
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "recipe-pwa" })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
