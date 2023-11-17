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
// const allowCors = require("./middleware/allowCors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
//MIDDLEWARES
// app.use(
//   cors({
//     origin: "*",
//   })
// );

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// app.use(allowCors);

// app.use(function (req, res, next) {
//   // CORS headers
//   res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
//   // Set custom headers for CORS
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Content-type,Accept,X-Custom-Header,Origin,X-Requested-With"
//   );

//   if (req.method === "OPTIONS" || req.method === "options") {
//     return res.status(200).end();
//   }

//   return next();
// });

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
