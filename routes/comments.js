const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

const User = require("../models/user");
const Meal = require("../models/meal");
const sendNotification = require("../services/sendNotification");

// Add a comment to a meal
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { mealId, text } = req.body;
    const userId = req.user.userId;

    // Find or create a meal by name
    const meal = await Meal.findOneAndUpdate(
      { name: mealId },
      { $addToSet: { comments: { author: userId, text, date: new Date() } } },
      { upsert: true, new: true }
    );

    res.json({ message: "Comment added successfully", meal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all comments for a meal by name
router.get("/list/:name", async (req, res) => {
  try {
    const name = req.params.name;
    const meal = await Meal.findOne({ name: name });
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    const comments = meal.comments;
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// Add a like to a comment
router.post("/like/add", authMiddleware, async (req, res) => {
  try {
    const { mealId, commentId } = req.body;
    const userId = req.user.userId;
    console.log("🚀 ~ file: comments.js:49 ~ router.post ~ mealId:", mealId);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Find or create a meal by name
    const meal = await Meal.findOneAndUpdate(
      { name: mealId },
      {},
      { upsert: true, new: true }
    );

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Find the comment by ID in the comments array
    const comment = meal.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already liked this comment" });
    }

    // Add the user's ID to the likes array
    comment.likes.push(userId);

    const notificationPayload = {
      title: `Like ❤️`,
      body: `${user.username} a like votre commentaire`, //the body of the push notification
      actions: [
        { action: "openLikeComment", title: "Voir", icon: "👀" },
        { action: "dismiss", title: "Fermer", icon: "❌" },
      ],
      image:
        "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1492523647/mrkkkgasub1waepp0agu.jpg",
      icon: "https://images.crunchbase.com/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_1/v1492523647/mrkkkgasub1waepp0agu.jpg",
      tag: "like_comment",
      data: {
        actionButtonLink: `${process.env.FRONT_BASE_URL}/recipe/${mealId}`,
      },
    };

    //TODO: Don't send notification is user like itself
    if (userId !== comment.author)
      sendNotification(comment.author, notificationPayload);

    // Save the updated meal
    await meal.save();

    res.json({ message: "Like added successfully", meal });
    //TODO: add notification
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check if a user has liked a comment
router.get("/hasLiked", authMiddleware, async (req, res) => {
  try {
    const { mealName, commentId } = req.query;
    const userId = req.user.userId;
    const meal = await Meal.findOne({ name: mealName });

    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    const comment = meal.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const hasLiked = comment.likes.includes(userId);
    res.json({ hasLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
