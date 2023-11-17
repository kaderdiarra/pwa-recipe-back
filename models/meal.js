const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const mealSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    comments: [commentSchema],
});

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;