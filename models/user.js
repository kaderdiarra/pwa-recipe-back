const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteMeals: [{ type: String }],
  notificationSubscription: {
    type: {
      endpoint: { type: String },
      expirationTime: { type: Number },
      keys: {
        p256dh: { type: String },
        auth: { type: String },
      },
    },
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
