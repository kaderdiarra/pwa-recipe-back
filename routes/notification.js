const express = require("express");
const router = express.Router();
const webpush = require("web-push");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();
const User = require("../models/user");
const sendNotification = require("../services/sendNotification");

const pushSubscription = {
  endpoint: "http://localhost:3000/notifications",
  keys: {
    auth: "",
    p256dh: "",
  },
};

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.post("/subscribe", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error("User id not defined");
    const subscription = req.body;

    console.log(
      "🚀 ~ file: notification.js:24 ~ router.post ~ subscription:",
      subscription
    );
    //TODO: get user
    const user = await User.findById(userId);
    user.notificationSubscription = subscription;
    await user.save();

    //TODO: save subscription inside user
    res.status(200).json({});

    // const payload = JSON.stringify({
    //   notification: {
    //     title: "Hello World! 🌍",
    //     body: "Testing notification system",
    //     icon: "assets/icons/epitech-logo.jpeg",
    //     actions: [
    //       { action: "View", title: "Action custom" },
    //       { action: "Dismiss", title: "Une autre action" },
    //     ],
    //     data: {
    // onActionClick: {
    //   default: {
    //     operation: "openWindow",
    //     url: "http://localhost:3000/notifications",
    //   },
    //   View: {
    //     operation: "focusLastFocusedOrOpen",
    //     url: "/recipe/view",
    //   },
    //   Dismiss: {
    //     operation: "navigateLastFocusedOrOpen",
    //     url: "/recipe/dismiss",
    //   },
    // },
    //     },
    //   },
    // });

    // webpush.sendNotification(subscription, payload);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/test", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    if (!userId) throw new Error("User id not defined");

    const payload = {
      title: "New Notification from Server",
      body: "Push notification from section.io", //the body of the push notification
      actions: [
        { action: "openLikeComment", title: "Voir", icon: "👀" },
        { action: "dismiss", title: "Fermer", icon: "❌" },
      ],
      image:
        "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1492523647/mrkkkgasub1waepp0agu.jpg",
      icon: "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1492523647/mrkkkgasub1waepp0agu.jpg",
      tag: "test",
      data: {
        actionButtonLink: "https://www.youtube.com",
      },
    };

    await sendNotification(userId, payload);
    return res.status(200).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
