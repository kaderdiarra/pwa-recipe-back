const webpush = require("web-push");
require("dotenv").config();
const User = require("../models/user");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendNotification = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.notificationSubscription) {
    webpush.sendNotification(
      user.notificationSubscription,
      JSON.stringify(payload)
    );
    console.log("🛫 Notification successfully sent!");
    return;
  }
  console.log(
    "Cannot send notification. 'notificationSubscription' not defined in user"
  );
  // throw new Error(
  //   "Cannot send notification. 'notificationSubscription' not defined in user"
  // );
};

module.exports = sendNotification;
